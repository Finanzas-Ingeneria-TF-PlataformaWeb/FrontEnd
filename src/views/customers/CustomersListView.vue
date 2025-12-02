<template>
  <div class="customers-page">
    <!-- Header -->
    <div class="customers-header">
      <div>
        <h2 class="customers-title">Clientes</h2>
        <p class="customers-subtitle">
          Administra los clientes que podrán simular créditos MiVivienda.
        </p>
      </div>

      <div class="header-actions">
        <div v-if="!loading" class="customers-pill">
          <span class="pill-dot"></span>
          {{ customers.length }} clientes registrados
        </div>

        <Button
            label="Nuevo cliente"
            icon="pi pi-plus"
            class="p-button-sm"
            @click="goNew"
        />
      </div>
    </div>

    <!-- Estado: cargando -->
    <div v-if="loading" class="state-card">
      <span class="state-title">Cargando clientes...</span>
      <p class="state-text">
        Estamos obteniendo la lista de clientes desde el backend.
      </p>
    </div>

    <!-- Estado: sin clientes -->
    <div v-else-if="!hasCustomers" class="state-card state-empty">
      <span class="state-title">Aún no hay clientes registrados</span>
      <p class="state-text">
        Registra un nuevo cliente con el botón
        <strong>“Nuevo cliente”</strong> para comenzar a simular créditos.
      </p>
    </div>

    <!-- Tabla -->
    <div v-else class="table-card">
      <DataTable
          :value="customers"
          paginator
          :rows="10"
          :rows-per-page-options="[10, 20, 50]"
          responsive-layout="scroll"
          row-hover
      >
        <!-- Columna Cliente (nombre + doc) -->
        <Column header="Cliente">
          <template #body="slotProps">
            <div class="cell-customer">
              <div class="avatar-circle">
                <span>
                  {{ getInitials(slotProps.data.fullName) }}
                </span>
              </div>
              <div class="customer-text">
                <span class="customer-name">
                  {{ slotProps.data.fullName || 'Sin nombre' }}
                </span>
                <span class="customer-doc" v-if="slotProps.data.documentNumber">
                  DNI / Doc: {{ slotProps.data.documentNumber }}
                </span>
              </div>
            </div>
          </template>
        </Column>

        <Column header="Estado civil">
          <template #body="slotProps">
            <span
                v-if="slotProps.data.maritalStatusLabel"
                class="chip chip-soft"
            >
              {{ slotProps.data.maritalStatusLabel }}
            </span>
            <span v-else class="text-muted">Sin registro</span>
          </template>
        </Column>

        <Column header="Tipo de empleo">
          <template #body="slotProps">
            <span
                v-if="slotProps.data.employmentTypeLabel"
                class="chip chip-outline"
            >
              {{ slotProps.data.employmentTypeLabel }}
            </span>
            <span v-else class="text-muted">No indicado</span>
          </template>
        </Column>

        <Column header="Dependientes">
          <template #body="slotProps">
            <span>
              {{ (slotProps.data.dependents ?? 0) }}
              {{
                (slotProps.data.dependents ?? 0) === 1
                    ? 'dependiente'
                    : 'dependientes'
              }}
            </span>
          </template>
        </Column>

        <Column header="Ingreso mensual">
          <template #body="slotProps">
            <span class="income-value">
              {{ formatCurrency(slotProps.data.monthlyIncome) }}
            </span>
          </template>
        </Column>

        <Column header="Acciones" body-class="text-right">
          <template #body="slotProps">
            <Button
                icon="pi pi-pencil"
                class="p-button-rounded p-button-text p-button-sm"
                v-tooltip.top="'Editar cliente'"
                @click="goEdit(slotProps.data.id)"
            />
          </template>
        </Column>
      </DataTable>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'

import { getCustomers } from '@/api/customersApi'

const router = useRouter()
const toast = useToast()

const rawCustomers = ref([])
const loading = ref(false)

const maritalStatusMap = {
  single: 'Soltero(a)',
  married: 'Casado(a)',
  cohabitant: 'Conviviente',
  divorced: 'Divorciado(a)',
  widowed: 'Viudo(a)'
}

const employmentTypeMap = {
  dependent: 'Dependiente',
  independent: 'Independiente',
  mixed: 'Mixto',
  unemployed: 'Desempleado'
}

// Mapeamos lo que viene del backend a lo que muestra la tabla
const customers = computed(() =>
    rawCustomers.value.map((c) => ({
      ...c,
      maritalStatusLabel: maritalStatusMap[c.maritalStatus] || '',
      employmentTypeLabel: employmentTypeMap[c.employmentType] || ''
    }))
)

const hasCustomers = computed(() => customers.value.length > 0)

function formatCurrency(value) {
  if (value == null) return '-'
  return (
      'S/ ' +
      Number(value).toLocaleString('es-PE', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })
  )
}

function getInitials(name) {
  if (!name) return '?'
  const parts = name
      .trim()
      .split(' ')
      .filter(Boolean)
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase()
  }
  return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase()
}

function goNew() {
  router.push({ name: 'customer-new' })
}

function goEdit(id) {
  router.push({ name: 'customer-edit', params: { id } })
}

onMounted(async () => {
  loading.value = true
  try {
    const response = await getCustomers()
    rawCustomers.value = response.data
  } catch (error) {
    console.error('Error al cargar clientes', error)
    toast.add({
      severity: 'error',
      summary: 'Error al cargar clientes',
      detail:
          error?.response?.data?.title ||
          error?.response?.data?.message ||
          'No se pudieron cargar los clientes desde el servidor.',
      life: 4000
    })
    rawCustomers.value = []
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.customers-page {
  animation: fadeIn 0.2s ease-out;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* Header */
.customers-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
}

.customers-title {
  font-size: 1.3rem;
  font-weight: 600;
  color: #0f172a;
  margin-bottom: 0.25rem;
}

.customers-subtitle {
  font-size: 0.85rem;
  color: #6b7280;
  margin: 0;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.customers-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.25rem 0.6rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 500;
  background: #eef2ff;
  color: #4f46e5;
  border: 1px solid #c7d2fe;
}

.pill-dot {
  width: 6px;
  height: 6px;
  border-radius: 999px;
  background: #6366f1;
}

/* Estados */
.state-card {
  background: #f9fafb;
  border-radius: 0.9rem;
  padding: 1rem 1.25rem;
  border: 1px dashed #e5e7eb;
}

.state-empty {
  background: #ecfeff;
  border-color: #67e8f9;
}

.state-title {
  font-size: 0.9rem;
  font-weight: 600;
  color: #111827;
}

.state-text {
  margin-top: 0.25rem;
  font-size: 0.8rem;
  color: #6b7280;
}

/* Card tabla */
.table-card {
  background: #ffffff;
  border-radius: 0.9rem;
  padding: 0.75rem 0.9rem 0.4rem;
  box-shadow: 0 8px 20px rgba(15, 23, 42, 0.06);
  border: 1px solid #e5e7eb;
}

/* Celdas */
.cell-customer {
  display: flex;
  align-items: center;
  gap: 0.7rem;
}

.avatar-circle {
  width: 2.4rem;
  height: 2.4rem;
  border-radius: 999px;
  background: linear-gradient(135deg, #4f46e5, #22c55e);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #f9fafb;
  font-weight: 600;
  font-size: 0.85rem;
}

.customer-text {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
}

.customer-name {
  font-size: 0.85rem;
  font-weight: 600;
  color: #111827;
}

.customer-doc {
  font-size: 0.78rem;
  color: #6b7280;
}

.text-muted {
  font-size: 0.78rem;
  color: #9ca3af;
}

.income-value {
  font-weight: 500;
  color: #047857;
}

/* Chips */
.chip {
  display: inline-flex;
  align-items: center;
  padding: 0.15rem 0.55rem;
  border-radius: 999px;
  font-size: 0.7rem;
  font-weight: 500;
}

.chip-soft {
  background: #fef3c7;
  color: #92400e;
}

.chip-outline {
  background: #ecfdf5;
  color: #047857;
  border: 1px solid #bbf7d0;
}

/* DataTable tweaks */
:deep(.p-datatable) {
  font-size: 0.8rem;
}

:deep(.p-datatable-thead > tr > th) {
  background: #f9fafb;
  color: #4b5563;
  font-weight: 600;
  font-size: 0.78rem;
}

:deep(.p-datatable-tbody > tr:nth-child(even)) {
  background: #f9fafb;
}

:deep(.p-datatable .p-datatable-tbody > tr.p-highlight) {
  background: #eef2ff;
}

/* Animación */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .customers-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .header-actions {
    width: 100%;
    justify-content: space-between;
  }
}
</style>
