<template>
  <div class="plan-page">
    <!-- Header -->
    <div class="plan-header">
      <div>
        <h2 class="plan-title">Plan de pagos</h2>
        <p class="plan-subtitle">
          Detalle del crédito simulado y cronograma de cuotas según el método francés.
        </p>
      </div>

      <div class="plan-pill">
        <span class="pill-dot"></span>
        Paso 2 de 2 · Plan de pagos
      </div>
    </div>

    <!-- Estados de carga / error -->
    <div v-if="loading" class="state-card">
      <span class="state-title">Cargando simulación...</span>
      <p class="state-text">
        Estamos recuperando el plan de pagos generado. Por favor, espera un momento.
      </p>
    </div>

    <div v-else-if="errorMessage" class="state-card state-error">
      <span class="state-title">No se pudo cargar la simulación</span>
      <p class="state-text">
        {{ errorMessage }}
      </p>
    </div>

    <div v-else-if="simulation">
      <!-- Resumen del crédito -->
      <section class="summary-section">
        <div class="section-header">
          <div>
            <h3 class="section-title">Resumen del crédito</h3>
            <p class="section-subtitle">
              Información clave del préstamo y rentabilidad del crédito.
            </p>
          </div>

          <div class="tags-container" v-if="summary.currency">
            <span class="tag">
              {{ summary.currency === 'PEN' ? 'Soles' : 'Dólares' }}
            </span>
            <span class="tag tag-soft">
              {{ totalInstallments }} cuotas
            </span>
          </div>
        </div>

        <div class="summary-card">
          <div class="summary-grid">
            <!-- Bloque principal: monto y cuota -->
            <div class="summary-item summary-item-main">
              <span class="summary-label">Monto del préstamo</span>
              <span class="summary-value">
                {{ formatCurrency(summary.loanAmount, summary.currency) }}
              </span>
              <span class="summary-caption">
                Incluye el monto efectivamente financiado por el banco.
              </span>
            </div>

            <div class="summary-item summary-item-main">
              <span class="summary-label">Cuota mensual aproximada</span>
              <span class="summary-value highlight">
                {{ formatCurrency(summary.monthlyInstallment, summary.currency) }}
              </span>
              <span class="summary-caption">
                Cuota calculada bajo el método francés (cuotas constantes).
              </span>
            </div>

            <!-- Plazo y tasas -->
            <div class="summary-item">
              <span class="summary-label">Plazo del crédito</span>
              <span class="summary-value">
                {{ summary.termYears }} años
              </span>
              <span class="summary-caption">
                {{ summary.termMonths }} meses · {{ totalInstallments }} cuotas estimadas
              </span>
            </div>

            <div class="summary-item">
              <span class="summary-label">Tasa anual</span>
              <span class="summary-value">
                {{ formatPercent(summary.annualRate) }}
              </span>
              <span class="summary-caption">
                Tasa nominal del crédito (referencial para el cálculo).
              </span>
            </div>

            <div class="summary-item">
              <span class="summary-label">Intereses totales</span>
              <span class="summary-value">
                {{ formatCurrency(summary.totalInterest, summary.currency) }}
              </span>
              <span class="summary-caption">
                Suma de todos los intereses pagados durante el plazo.
              </span>
            </div>

            <div class="summary-item">
              <span class="summary-label">Monto total a pagar</span>
              <span class="summary-value">
                {{ formatCurrency(summary.totalPayable, summary.currency) }}
              </span>
              <span class="summary-caption">
                Capital + intereses durante toda la vida del crédito.
              </span>
            </div>

            <!-- Indicadores financieros -->
            <div class="summary-item">
              <span class="summary-label">VAN (posición banco)</span>
              <span class="summary-value">
                {{ formatCurrency(summary.npv, summary.currency) }}
              </span>
              <span class="summary-caption">
                Valor Actual Neto del flujo de pagos del crédito.
              </span>
            </div>

            <div class="summary-item">
              <span class="summary-label">TIR anual</span>
              <span class="summary-value">
                {{ formatPercent(summary.irrAnnual) }}
              </span>
              <span class="summary-caption">
                Tasa Interna de Retorno anual del crédito.
              </span>
            </div>

            <div class="summary-item">
              <span class="summary-label">TCEA</span>
              <span class="summary-value">
                {{ formatPercent(summary.tcea) }}
              </span>
              <span class="summary-caption">
                Tasa de Costo Efectivo Anual (incluye costo financiero total).
              </span>
            </div>

            <div class="summary-item" v-if="firstInstallment || lastInstallment">
              <span class="summary-label">Periodo de pago</span>
              <span class="summary-value">
                <span v-if="firstInstallment">
                  Desde {{ formatDate(firstInstallment) }}
                </span>
                <span v-if="lastInstallment">
                  hasta {{ formatDate(lastInstallment) }}
                </span>
              </span>
              <span class="summary-caption">
                Rango estimado entre la primera y la última cuota.
              </span>
            </div>
          </div>
        </div>
      </section>

      <!-- Cronograma -->
      <section class="schedule-section">
        <div class="section-header">
          <div>
            <h3 class="section-title">
              Cronograma de pagos (método francés)
            </h3>
            <p class="section-subtitle">
              Detalle cuota por cuota del saldo, interés, amortización y cuota total.
            </p>
          </div>
        </div>

        <div class="schedule-card">
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
        </div>
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

const summary = computed(() => simulation.value?.summary || {})

const schedule = computed(() => simulation.value?.schedule || [])

const totalInstallments = computed(() => schedule.value.length || 0)

const firstInstallment = computed(() =>
    schedule.value.length > 0 ? schedule.value[0].date : null
)

const lastInstallment = computed(() =>
    schedule.value.length > 0 ? schedule.value[schedule.value.length - 1].date : null
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
        'No se proporcionó el identificador de la simulación. Vuelve a configurar el crédito.'
    return
  }

  loading.value = true
  try {
    const response = await getSimulation(id)
    simulation.value = response.data
  } catch (error) {
    console.error('Error al cargar simulación', error)
    errorMessage.value =
        'No se encontró la simulación. Genera una nueva desde la pantalla de configuración.'
    toast.add({
      severity: 'error',
      summary: 'Simulación no encontrada',
      detail: error?.response?.data?.message || error.message,
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

<style scoped>
.plan-page {
  animation: fadeIn 0.2s ease-out;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* Header */
.plan-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
}

.plan-title {
  font-size: 1.3rem;
  font-weight: 600;
  color: #064e3b;
  margin-bottom: 0.25rem;
}

.plan-subtitle {
  font-size: 0.85rem;
  color: #6b7280;
  margin: 0;
}

.plan-pill {
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

.state-error {
  border-color: #fecaca;
  background: #fef2f2;
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

/* Secciones */
.summary-section,
.schedule-section {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 0.75rem;
}

.section-title {
  font-size: 0.95rem;
  font-weight: 600;
  color: #111827;
  margin-bottom: 0.1rem;
}

.section-subtitle {
  font-size: 0.8rem;
  color: #6b7280;
  margin: 0;
}

/* Tags */
.tags-container {
  display: flex;
  gap: 0.35rem;
  flex-wrap: wrap;
}

.tag {
  padding: 0.15rem 0.5rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 500;
  background: #ecfdf5;
  color: #047857;
  border: 1px solid #bbf7d0;
}

.tag-soft {
  background: #eff6ff;
  color: #1d4ed8;
  border-color: #bfdbfe;
}

/* Resumen */
.summary-card {
  background: #ffffff;
  border-radius: 0.9rem;
  padding: 1rem 1.25rem;
  box-shadow: 0 6px 18px rgba(15, 23, 42, 0.06);
  border: 1px solid #e5e7eb;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
  gap: 0.85rem;
}

.summary-item {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.summary-item-main {
  padding: 0.35rem 0.55rem;
  border-radius: 0.6rem;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
}

.summary-label {
  font-size: 0.78rem;
  font-weight: 500;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.summary-value {
  font-size: 1rem;
  font-weight: 600;
  color: #111827;
}

.summary-value.highlight {
  font-size: 1.2rem;
  color: #065f46;
}

.summary-caption {
  font-size: 0.75rem;
  color: #9ca3af;
}

/* Cronograma */
.schedule-card {
  background: #ffffff;
  border-radius: 0.9rem;
  padding: 0.75rem 0.9rem 0.4rem;
  box-shadow: 0 6px 18px rgba(15, 23, 42, 0.05);
  border: 1px solid #e5e7eb;
}

/* Ajustes DataTable */
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
  .plan-header {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
