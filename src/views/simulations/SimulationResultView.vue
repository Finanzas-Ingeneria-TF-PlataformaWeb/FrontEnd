<template>
  <div>
    <h2 class="mb-3">Plan de pagos</h2>

    <div v-if="loading">
      Cargando simulación...
    </div>

    <div v-else-if="errorMessage">
      <p class="text-sm">
        {{ errorMessage }}
      </p>
    </div>

    <div v-else-if="simulation">
      <!-- Resumen -->
      <section class="mb-4">
        <h3 class="mb-2">Resumen del crédito</h3>
        <div class="grid text-sm">
          <div class="col-12 md:col-3">
            <strong>Monto del préstamo:</strong><br />
            {{ formatCurrency(summary.loanAmount, summary.currency) }}
          </div>
          <div class="col-12 md:col-3">
            <strong>Moneda:</strong><br />
            {{ summary.currency === 'PEN' ? 'Soles' : 'Dólares' }}
          </div>
          <div class="col-12 md:col-3">
            <strong>Tasa anual:</strong><br />
            {{ formatPercent(summary.annualRate) }}
          </div>
          <div class="col-12 md:col-3">
            <strong>Cuota mensual aprox.:</strong><br />
            {{ formatCurrency(summary.monthlyInstallment, summary.currency) }}
          </div>
          <div class="col-12 md:col-3 mt-3">
            <strong>Plazo:</strong><br />
            {{ summary.termYears }} años ({{ summary.termMonths }} meses)
          </div>
          <div class="col-12 md:col-3 mt-3">
            <strong>Intereses totales:</strong><br />
            {{ formatCurrency(summary.totalInterest, summary.currency) }}
          </div>
          <div class="col-12 md:col-3 mt-3">
            <strong>Monto total a pagar:</strong><br />
            {{ formatCurrency(summary.totalPayable, summary.currency) }}
          </div>
          <div class="col-12 md:col-3 mt-3">
            <strong>VAN:</strong><br />
            {{ formatCurrency(summary.npv, summary.currency) }}
          </div>
          <div class="col-12 md:col-3 mt-3">
            <strong>TIR anual:</strong><br />
            {{ formatPercent(summary.irrAnnual) }}
          </div>
          <div class="col-12 md:col-3 mt-3">
            <strong>TCEA:</strong><br />
            {{ formatPercent(summary.tcea) }}
          </div>

        </div>
      </section>

      <!-- Cronograma -->
      <section>
        <h3 class="mb-2">Cronograma de pagos (método francés – demo)</h3>

        <DataTable
            :value="simulation.schedule"
            paginator
            :rows="10"
            responsive-layout="scroll"
            :rows-per-page-options="[10, 20, 50]"
        >
          <Column
              field="installmentNumber"
              header="#"
          />
          <Column header="Fecha">
            <template #body="slotProps">
              {{ formatDate(slotProps.data.date) }}
            </template>
          </Column>
          <Column header="Saldo inicial">
            <template #body="slotProps">
              {{
                formatCurrency(
                    slotProps.data.initialBalance,
                    summary.currency
                )
              }}
            </template>
          </Column>
          <Column header="Interés">
            <template #body="slotProps">
              {{
                formatCurrency(
                    slotProps.data.interest,
                    summary.currency
                )
              }}
            </template>
          </Column>
          <Column header="Amortización">
            <template #body="slotProps">
              {{
                formatCurrency(
                    slotProps.data.amortization,
                    summary.currency
                )
              }}
            </template>
          </Column>
          <Column header="Cuota">
            <template #body="slotProps">
              {{
                formatCurrency(
                    slotProps.data.installment,
                    summary.currency
                )
              }}
            </template>
          </Column>
          <Column header="Saldo final">
            <template #body="slotProps">
              {{
                formatCurrency(
                    slotProps.data.finalBalance,
                    summary.currency
                )
              }}
            </template>
          </Column>
        </DataTable>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useToast } from 'primevue/usetoast'

import { getSimulation } from '@/api/simulationsApi'

const route = useRoute()
const toast = useToast()

const simulation = ref(null)
const loading = ref(false)
const errorMessage = ref('')

const summary = computed(
    () => simulation.value?.summary || {}
)

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

async function loadSimulation() {
  const id = route.params.id
  if (!id) {
    errorMessage.value =
        'No se proporcionó el identificador de la simulación.'
    return
  }

  loading.value = true
  try {
    const response = await getSimulation(id)
    simulation.value = response.data
  } catch (error) {
    errorMessage.value =
        'No se encontró la simulación (modo demo). Genera una nueva desde la configuración.'
    toast.add({
      severity: 'error',
      summary: 'Simulación no encontrada',
      detail: error.message,
      life: 4000
    })
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadSimulation()
})
</script>
