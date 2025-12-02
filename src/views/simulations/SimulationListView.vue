<template>
  <div class="history-page">
    <!-- Header -->
    <div class="history-header">
      <div>
        <h2 class="history-title">Historial de simulaciones</h2>
        <p class="history-subtitle">
          Revisa los créditos simulados y accede rápidamente al detalle del plan de pagos.
        </p>
      </div>

      <div class="history-pill" v-if="!loading">
        <span class="pill-dot"></span>
        {{ simulations.length }} simulaciones registradas
      </div>
    </div>

    <!-- Estado: cargando -->
    <div v-if="loading" class="state-card">
      <span class="state-title">Cargando simulaciones...</span>
      <p class="state-text">
        Estamos obteniendo el historial desde el backend.
      </p>
    </div>

    <!-- Estado: sin datos -->
    <div v-else-if="!hasSimulations" class="state-card state-empty">
      <span class="state-title">Aún no tienes simulaciones registradas</span>
      <p class="state-text">
        Genera una nueva simulación desde la pantalla
        <strong>Configurar simulación</strong> para visualizar el plan de pagos y su historial.
      </p>
    </div>

    <!-- Tabla -->
    <div v-else class="history-card">
      <DataTable
          :value="simulations"
          paginator
          :rows="10"
          :rows-per-page-options="[10, 20, 50]"
          responsive-layout="scroll"
          row-hover
      >
        <Column field="id" header="#"></Column>

        <Column header="Fecha">
          <template #body="slotProps">
            {{ formatDate(slotProps.data.createdAt) }}
          </template>
        </Column>

        <!-- Cliente con "avatar" de iniciales -->
        <Column header="Cliente">
          <template #body="slotProps">
            <div class="cell-with-avatar">
              <div class="avatar-small">
                {{ getInitials(slotProps.data.customerName) }}
              </div>
              <div class="cell-text">
                <span class="cell-primary">
                  {{ slotProps.data.customerName || 'Sin nombre' }}
                </span>
                <span class="cell-secondary">
                  ID sim: {{ slotProps.data.id }}
                </span>
              </div>
            </div>
          </template>
        </Column>

        <!-- Inmueble -->
        <Column header="Inmueble">
          <template #body="slotProps">
            <div class="cell-property">
              <span class="cell-primary">
                {{ slotProps.data.propertyName || 'Sin nombre' }}
              </span>
              <span class="cell-tag">
                {{ slotProps.data.currency === 'USD' ? 'USD' : 'PEN' }}
              </span>
            </div>
          </template>
        </Column>

        <Column header="Monto">
          <template #body="slotProps">
            {{
              formatCurrency(
                  slotProps.data.loanAmount,
                  slotProps.data.currency
              )
            }}
          </template>
        </Column>

        <Column header="Plazo">
          <template #body="slotProps">
            {{ slotProps.data.years }} años
          </template>
        </Column>

        <Column header="Tasa anual">
          <template #body="slotProps">
            {{ formatPercent(slotProps.data.annualRate) }}
          </template>
        </Column>

        <Column header="Cuota">
          <template #body="slotProps">
            {{
              formatCurrency(
                  slotProps.data.monthlyInstallment,
                  slotProps.data.currency
              )
            }}
          </template>
        </Column>

        <Column header="Total a pagar">
          <template #body="slotProps">
            {{
              formatCurrency(
                  slotProps.data.totalPayable,
                  slotProps.data.currency
              )
            }}
          </template>
        </Column>

        <Column header="TIR / TCEA">
          <template #body="slotProps">
            <div class="cell-metrics">
              <span>
                TIR: {{ formatPercent(slotProps.data.irrAnnual) }}
              </span>
              <span>
                TCEA: {{ formatPercent(slotProps.data.tcea) }}
              </span>
            </div>
          </template>
        </Column>

        <Column header="Acciones" body-class="text-right">
          <template #body="slotProps">
            <Button
                label="Ver detalle"
                size="small"
                class="p-button-text p-button-sm"
                icon="pi pi-search"
                @click="goToDetail(slotProps.data.id)"
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

import { listSimulations } from '@/api/simulationsApi'

const router = useRouter()
const toast = useToast()

const simulations = ref([])
const loading = ref(false)

const hasSimulations = computed(() => simulations.value.length > 0)

function formatCurrency(value, currency) {
  if (value == null) return '-'
  const prefix = currency === 'USD' ? '$' : 'S/'
  return (
      prefix +
      ' ' +
      Number(value).toLocaleString('es-PE', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })
  )
}

function formatPercent(value) {
  if (value == null) return '-'
  const percent = Number(value) * 100
  return `${percent.toFixed(2)} %`
}

function formatDate(value) {
  if (!value) return '-'
  const date = new Date(value)
  return date.toLocaleDateString('es-PE')
}

function getInitials(name) {
  if (!name) return 'CL'
  const parts = String(name)
      .trim()
      .split(' ')
      .filter((p) => p.length > 0)
  if (parts.length === 0) return 'CL'
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase()
  return (
      parts[0].charAt(0).toUpperCase() +
      parts[parts.length - 1].charAt(0).toUpperCase()
  )
}

function goToDetail(id) {
  router.push({
    name: 'simulations-result',
    params: { id: String(id) }
  })
}

async function loadSimulations() {
  loading.value = true
  try {
    const { data } = await listSimulations()
    simulations.value = data
  } catch (error) {
    console.error('Error cargando simulaciones', error)
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'No se pudo cargar el historial de simulaciones.',
      life: 4000
    })
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadSimulations()
})
</script>

<style scoped>
.history-page {
  animation: fadeIn 0.2s ease-out;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* Header */
.history-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
}

.history-title {
  font-size: 1.3rem;
  font-weight: 600;
  color: #064e3b;
  margin-bottom: 0.25rem;
}

.history-subtitle {
  font-size: 0.85rem;
  color: #6b7280;
  margin: 0;
}

.history-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.25rem 0.6rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 500;
  background: #ecfdf5;
  color: #047857;
  border: 1px solid #bbf7d0;
}

.pill-dot {
  width: 6px;
  height: 6px;
  border-radius: 999px;
  background: #22c55e;
}

/* Estados */
.state-card {
  background: #f9fafb;
  border-radius: 0.9rem;
  padding: 1rem 1.25rem;
  border: 1px dashed #e5e7eb;
}

.state-empty {
  background: #fefce8;
  border-color: #facc15;
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
.history-card {
  background: #ffffff;
  border-radius: 0.9rem;
  padding: 0.75rem 0.9rem 0.4rem;
  box-shadow: 0 8px 20px rgba(15, 23, 42, 0.06);
  border: 1px solid #e5e7eb;
}

/* Celdas personalizadas */
.cell-with-avatar {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.avatar-small {
  width: 2rem;
  height: 2rem;
  border-radius: 999px;
  background: linear-gradient(135deg, #16a34a, #22c55e);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ecfdf3;
  font-weight: 600;
  font-size: 0.85rem;
}

.cell-text {
  display: flex;
  flex-direction: column;
  line-height: 1.1;
}

.cell-primary {
  font-size: 0.85rem;
  font-weight: 500;
  color: #111827;
}

.cell-secondary {
  font-size: 0.75rem;
  color: #9ca3af;
}

.cell-property {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.4rem;
}

.cell-tag {
  padding: 0.1rem 0.45rem;
  border-radius: 999px;
  font-size: 0.7rem;
  font-weight: 500;
  background: #eff6ff;
  color: #1d4ed8;
}

/* TIR/TCEA */
.cell-metrics {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
  font-size: 0.78rem;
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
  background: #ecfdf5;
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
  .history-header {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
