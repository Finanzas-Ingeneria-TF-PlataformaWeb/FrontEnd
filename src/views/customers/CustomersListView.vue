<template>
  <div>
    <div class="flex justify-content-between align-items-center mb-3">
      <h2 class="m-0">Clientes</h2>
      <Button
          label="Nuevo cliente"
          icon="pi pi-plus"
          @click="goNew"
      />
    </div>

    <DataTable
        :value="customers"
        paginator
        :rows="10"
        responsive-layout="scroll"
        :loading="loading"
        empty-message="No hay clientes registrados."
    >
      <Column field="fullName" header="Nombre" />
      <Column field="documentNumber" header="Documento" />
      <Column field="maritalStatusLabel" header="Estado civil" />
      <Column field="employmentTypeLabel" header="Tipo de empleo" />
      <Column field="dependents" header="Dependientes" />
      <Column field="monthlyIncome" header="Ingreso mensual" />
      <Column header="Acciones" bodyClass="text-center">
        <template #body="slotProps">
          <Button
              icon="pi pi-pencil"
              text
              @click="goEdit(slotProps.data.id)"
          />
        </template>
      </Column>
    </DataTable>
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

function goNew () {
  router.push({ name: 'customer-new' })
}

function goEdit (id) {
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
    // Dejamos rawCustomers vacío para que se vea el mensaje "No hay clientes registrados."
    rawCustomers.value = []
  } finally {
    loading.value = false
  }
})
</script>
