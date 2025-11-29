<template>
  <div>
    <h2 class="mb-3">Historial de simulaciones</h2>

    <div v-if="loading">
      Cargando simulaciones...
    </div>

    <div v-else>
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

        <Column field="customerName" header="Cliente"></Column>
        <Column field="propertyName" header="Inmueble"></Column>

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
            TIR: {{ formatPercent(slotProps.data.irrAnnual) }}<br />
            TCEA: {{ formatPercent(slotProps.data.tcea) }}
          </template>
        </Column>

        <Column header="Acciones">
          <template #body="slotProps">
            <Button
                label="Ver detalle"
                size="small"
                @click="goToDetail(slotProps.data.id)"
            />
          </template>
        </Column>
      </DataTable>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'

import { listSimulations } from '@/api/simulationsApi'

const router = useRouter()
const toast = useToast()

const simulations = ref([])
const loading = ref(false)

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
