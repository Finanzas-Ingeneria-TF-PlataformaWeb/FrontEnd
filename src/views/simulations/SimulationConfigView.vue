<template>
  <div class="simulation-config-page">
    <!-- Header -->
    <div class="config-header">
      <div>
        <h2 class="config-title">Configurar simulación</h2>
        <p class="config-subtitle">
          Define el cliente, la unidad inmobiliaria y las condiciones del crédito para generar el plan de pagos.
        </p>
      </div>

      <div class="config-pill">
        <span class="pill-dot"></span>
        Paso 1 de 2 · Configuración
      </div>
    </div>

    <div class="grid config-grid">
      <!-- Columna izquierda -->
      <div class="col-12 lg:col-6 flex flex-column gap-4">
        <!-- Cliente e inmueble -->
        <section class="form-section">
          <div class="section-header">
            <div>
              <h3 class="section-title">Cliente e inmueble</h3>
              <p class="section-subtitle">
                Selecciona al solicitante y la unidad que se va a financiar.
              </p>
            </div>
          </div>

          <div class="section-body flex flex-column gap-3">
            <div class="flex flex-column gap-2">
              <label for="customer" class="field-label required">
                Cliente
              </label>
              <Dropdown
                  id="customer"
                  v-model="form.customerId"
                  :options="customers"
                  option-label="label"
                  option-value="id"
                  placeholder="Selecciona un cliente"
                  :loading="loadingCustomers"
                  class="w-full"
              />
              <small v-if="selectedCustomer" class="field-help">
                Documento:
                <strong>{{ selectedCustomer.documentNumber }}</strong>
              </small>
            </div>

            <div class="flex flex-column gap-2">
              <label for="property" class="field-label required">
                Unidad inmobiliaria
              </label>
              <Dropdown
                  id="property"
                  v-model="form.propertyId"
                  :options="properties"
                  option-label="label"
                  option-value="id"
                  placeholder="Selecciona una unidad"
                  :loading="loadingProperties"
                  class="w-full"
              />
              <small v-if="selectedProperty" class="field-help">
                Precio referencial:
                <strong>{{ formatCurrency(selectedProperty.price, selectedProperty.currency) }}</strong>
                · Área:
                <strong>{{ selectedProperty.areaM2 ?? selectedProperty.area }} m²</strong>
              </small>
            </div>
          </div>
        </section>

        <!-- Monto y plazo -->
        <section class="form-section">
          <div class="section-header">
            <div>
              <h3 class="section-title">Monto y plazo del crédito</h3>
              <p class="section-subtitle">
                Define el monto solicitado, moneda y duración del préstamo.
              </p>
            </div>
          </div>

          <div class="section-body flex flex-column gap-3">
            <div class="flex gap-2">
              <div class="flex flex-column gap-2 w-4">
                <label for="currency" class="field-label required">
                  Moneda
                </label>
                <Dropdown
                    id="currency"
                    v-model="form.currency"
                    :options="currencyOptions"
                    option-label="label"
                    option-value="value"
                    placeholder="Selecciona moneda"
                    class="w-full"
                />
              </div>

              <div class="flex flex-column gap-2 w-8">
                <label for="loanAmount" class="field-label required">
                  Monto del préstamo
                </label>
                <InputNumber
                    id="loanAmount"
                    v-model="form.loanAmount"
                    mode="currency"
                    :currency="form.currency || 'PEN'"
                    locale="es-PE"
                    class="w-full"
                    placeholder="Ej: 250,000.00"
                />
                <small class="field-help">
                  Corresponde al monto financiado después de cuota inicial y bonos.
                </small>
              </div>
            </div>

            <div class="flex gap-2">
              <div class="flex flex-column gap-2 w-6">
                <label for="startDate" class="field-label">
                  Fecha de desembolso
                </label>
                <Calendar
                    id="startDate"
                    v-model="form.startDate"
                    date-format="dd/mm/yy"
                    show-icon
                    class="w-full"
                />
              </div>

              <div class="flex flex-column gap-2 w-6">
                <label for="termYears" class="field-label required">
                  Plazo (años)
                </label>
                <InputNumber
                    id="termYears"
                    v-model="form.termYears"
                    :min="1"
                    :max="30"
                    show-buttons
                />
                <small class="field-help">
                  Aproximadamente {{ termMonths }} cuotas mensuales.
                </small>
              </div>
            </div>
          </div>
        </section>
      </div>

      <!-- Columna derecha -->
      <div class="col-12 lg:col-6 flex flex-column gap-4">
        <!-- Tasa de interés -->
        <section class="form-section">
          <div class="section-header">
            <div>
              <h3 class="section-title">Tasa de interés</h3>
              <p class="section-subtitle">
                Configura el tipo de tasa y su capitalización.
              </p>
            </div>
          </div>

          <div class="section-body flex flex-column gap-3">
            <div class="flex flex-column gap-2">
              <label for="rateType" class="field-label required">
                Tipo de tasa
              </label>
              <Dropdown
                  id="rateType"
                  v-model="form.rateType"
                  :options="rateTypeOptions"
                  option-label="label"
                  option-value="value"
                  placeholder="Selecciona tipo de tasa"
                  class="w-full"
              />
            </div>

            <div class="flex flex-column gap-2">
              <label for="annualRate" class="field-label required">
                Tasa anual
                <span v-if="form.rateType === 'effective'">
                  (TEA)
                </span>
                <span v-else-if="form.rateType === 'nominal'">
                  (TNA)
                </span>
              </label>
              <InputNumber
                  id="annualRate"
                  v-model="form.annualRate"
                  :minFractionDigits="2"
                  :maxFractionDigits="4"
                  suffix="%"
                  placeholder="Ej: 10.50"
              />
              <small class="field-help" v-if="form.rateType === 'effective'">
                Tasa Efectiva Anual (TEA) usada directamente para el cálculo de cuotas.
              </small>
              <small class="field-help" v-else>
                Tasa Nominal Anual (TNA) que se capitaliza según la frecuencia indicada.
              </small>
            </div>

            <div
                v-if="form.rateType === 'nominal'"
                class="flex flex-column gap-2"
            >
              <label for="capitalization" class="field-label">
                Capitalización
              </label>
              <Dropdown
                  id="capitalization"
                  v-model="form.capitalization"
                  :options="capitalizationOptions"
                  option-label="label"
                  option-value="value"
                  placeholder="Selecciona frecuencia"
                  class="w-full"
              />
            </div>
          </div>
        </section>

        <!-- Gracia y bono -->
        <section class="form-section">
          <div class="section-header">
            <div>
              <h3 class="section-title">Periodo de gracia y bono</h3>
              <p class="section-subtitle">
                Ajusta periodos de gracia y subsidios aplicables al crédito.
              </p>
            </div>
          </div>

          <div class="section-body flex flex-column gap-3">
            <div class="flex gap-2">
              <div class="flex flex-column gap-2 w-6">
                <label for="graceType" class="field-label">
                  Tipo de gracia
                </label>
                <Dropdown
                    id="graceType"
                    v-model="form.graceType"
                    :options="graceTypeOptions"
                    option-label="label"
                    option-value="value"
                    placeholder="Sin periodo de gracia"
                    class="w-full"
                />
              </div>

              <div
                  class="flex flex-column gap-2 w-6"
                  v-if="form.graceType !== 'none'"
              >
                <label for="graceMonths" class="field-label">
                  Meses de gracia
                </label>
                <InputNumber
                    id="graceMonths"
                    v-model="form.graceMonths"
                    :min="0"
                    :max="24"
                    show-buttons
                />
                <small class="field-help">
                  Máximo 24 meses de gracia total o parcial.
                </small>
              </div>
            </div>

            <div class="flex flex-column gap-2">
              <label for="subsidyAmount" class="field-label">
                Bono / subsidio MiVivienda (opcional)
              </label>
              <InputNumber
                  id="subsidyAmount"
                  v-model="form.subsidyAmount"
                  mode="currency"
                  :currency="form.currency || 'PEN'"
                  locale="es-PE"
                  placeholder="Ej: 40,250.00"
              />
              <small class="field-help">
                Si el cliente aplica a bono, ingresa el monto que se resta al precio de venta.
              </small>
            </div>
          </div>
        </section>
      </div>
    </div>

    <!-- Acciones -->
    <div class="config-actions mt-3">
      <Button
          label="Calcular plan de pagos"
          icon="pi pi-calculator"
          :loading="loading"
          class="p-button-success"
          @click="onCalculate"
      />
    </div>
  </div>
</template>

<script setup>
import {
  reactive,
  ref,
  computed,
  onMounted
} from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'

import { getCustomers } from '@/api/customersApi'
import { getProperties } from '@/api/propertiesApi'
import { calculateSimulation } from '@/api/simulationsApi'

const router = useRouter()
const toast = useToast()

const customers = ref([])
const properties = ref([])

const loadingCustomers = ref(false)
const loadingProperties = ref(false)
const loading = ref(false)

const currencyOptions = [
  { label: 'Soles (PEN)', value: 'PEN' },
  { label: 'Dólares (USD)', value: 'USD' }
]

const rateTypeOptions = [
  { label: 'Efectiva anual (TEA)', value: 'effective' },
  { label: 'Nominal anual (TNA)', value: 'nominal' }
]

const capitalizationOptions = [
  { label: 'Mensual', value: 'monthly' },
  { label: 'Bimestral', value: 'bimonthly' },
  { label: 'Trimestral', value: 'quarterly' },
  { label: 'Semestral', value: 'semiannual' },
  { label: 'Anual', value: 'annual' }
]

const graceTypeOptions = [
  { label: 'Sin gracia', value: 'none' },
  { label: 'Gracia total', value: 'total' },
  { label: 'Gracia parcial', value: 'partial' }
]

const form = reactive({
  customerId: null,
  propertyId: null,
  currency: 'PEN',
  loanAmount: null,
  startDate: new Date(),
  termYears: 20,
  rateType: 'effective',      // 'effective' (TEA) o 'nominal' (TNA)
  annualRate: 10.5,
  capitalization: 'monthly',
  graceType: 'none',
  graceMonths: 0,
  subsidyAmount: null
})

const termMonths = computed(() =>
    form.termYears ? form.termYears * 12 : 0
)

const selectedCustomer = computed(() =>
    customers.value.find((c) => c.id === form.customerId) || null
)

const selectedProperty = computed(() =>
    properties.value.find((p) => p.id === form.propertyId) || null
)

function buildLabelForCustomer(c) {
  return `${c.fullName} (${c.documentNumber})`
}

function buildLabelForProperty(p) {
  const projectName = p.projectName || p.name || '(Sin nombre)'
  const code = p.code || ''
  return code ? `${projectName} - ${code}` : projectName
}

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

async function loadCustomers() {
  loadingCustomers.value = true
  try {
    const response = await getCustomers()
    customers.value = response.data.map((c) => ({
      ...c,
      label: buildLabelForCustomer(c)
    }))
  } catch (error) {
    customers.value = [
      {
        id: 1,
        fullName: 'Juan Pérez',
        documentNumber: '12345678'
      },
      {
        id: 2,
        fullName: 'María López',
        documentNumber: '87654321'
      }
    ].map((c) => ({
      ...c,
      label: buildLabelForCustomer(c)
    }))

    toast.add({
      severity: 'warn',
      summary: 'Clientes demo',
      detail: 'Aún no hay backend de clientes, usando datos de ejemplo.',
      life: 3000
    })
  } finally {
    loadingCustomers.value = false
  }
}

async function loadProperties() {
  loadingProperties.value = true
  try {
    const response = await getProperties()
    properties.value = response.data.map((p) => ({
      ...p,
      label: buildLabelForProperty(p)
    }))
  } catch (error) {
    properties.value = [
      {
        id: 1,
        projectName: 'Residencial Los Álamos',
        code: 'D101'
      },
      {
        id: 2,
        projectName: 'Condominio Los Olivos',
        code: 'C202'
      }
    ].map((p) => ({
      ...p,
      label: buildLabelForProperty(p)
    }))

    toast.add({
      severity: 'warn',
      summary: 'Unidades demo',
      detail: 'Aún no hay backend de unidades, usando datos de ejemplo.',
      life: 3000
    })
  } finally {
    loadingProperties.value = false
  }
}

function validateRequired() {
  const requiredFields = [
    { value: form.customerId, label: 'Cliente' },
    { value: form.propertyId, label: 'Unidad inmobiliaria' },
    { value: form.currency, label: 'Moneda' },
    { value: form.loanAmount, label: 'Monto del préstamo' },
    { value: form.termYears, label: 'Plazo (años)' },
    { value: form.rateType, label: 'Tipo de tasa' },
    { value: form.annualRate, label: 'Tasa anual' }
  ]

  const missing = requiredFields.filter((f) => !f.value && f.value !== 0)

  if (missing.length > 0) {
    const names = missing.map((f) => f.label).join(', ')
    toast.add({
      severity: 'warn',
      summary: 'Campos obligatorios',
      detail: `Completa: ${names}.`,
      life: 4000
    })
    return false
  }

  return true
}

// Helper para mandar la fecha como "yyyy-MM-dd" (DateOnly)
function toApiDate(d) {
  if (!d) return null
  const date = new Date(d)
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

async function onCalculate() {
  if (!validateRequired()) {
    return
  }

  const payload = {
    customerId: form.customerId,
    propertyId: form.propertyId,
    loanAmount: form.loanAmount,
    currency: form.currency,
    rateType: form.rateType,
    annualRate: form.annualRate,
    nominalCapitalization:
        form.rateType === 'nominal' ? form.capitalization : null,
    years: form.termYears,
    totalGraceMonths:
        form.graceType === 'total' ? form.graceMonths : 0,
    partialGraceMonths:
        form.graceType === 'partial' ? form.graceMonths : 0,
    firstInstallmentDate: toApiDate(form.startDate)
  }

  loading.value = true

  try {
    const response = await calculateSimulation(payload)
    const data = response.data

    console.log('Respuesta POST /simulations:', data)

    const simulationId = data?.simulationId ?? data?.id

    if (!simulationId && simulationId !== 0) {
      console.error('La respuesta no trae un identificador de simulación')
      toast.add({
        severity: 'error',
        summary: 'Error al simular',
        detail: 'La simulación se calculó, pero no se recibió un identificador.',
        life: 4000
      })
      return
    }

    toast.add({
      severity: 'success',
      summary: 'Simulación generada',
      detail: 'Se generó el plan de pagos.',
      life: 3000
    })

    await router.push({
      name: 'simulations-result',
      params: { id: String(simulationId) }
    })
  } catch (error) {
    console.error('Error al simular', error.response?.data || error.message)

    toast.add({
      severity: 'error',
      summary: 'Error al simular',
      detail: 'No se pudo generar la simulación.',
      life: 3000
    })
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadCustomers()
  loadProperties()
})
</script>

<style scoped>
.simulation-config-page {
  animation: fadeIn 0.2s ease-out;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.config-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
}

.config-title {
  font-size: 1.3rem;
  font-weight: 600;
  color: #064e3b;
  margin-bottom: 0.25rem;
}

.config-subtitle {
  font-size: 0.85rem;
  color: #6b7280;
  margin: 0;
}

.config-pill {
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

.config-grid {
  row-gap: 1.25rem;
}

/* Secciones tipo card */
.form-section {
  background: #ffffff;
  border-radius: 0.9rem;
  padding: 1rem 1.1rem;
  box-shadow: 0 6px 18px rgba(15, 23, 42, 0.06);
  border: 1px solid #e5e7eb;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.6rem;
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

.section-body {
  margin-top: 0.4rem;
}

.field-label {
  font-size: 0.8rem;
  font-weight: 500;
  color: #4b5563;
}

.field-label.required::after {
  content: ' *';
  color: #dc2626;
}

.field-help {
  font-size: 0.75rem;
  color: #9ca3af;
}

/* PrimeVue inputs */
:deep(.p-inputtext),
:deep(.p-dropdown),
:deep(.p-inputnumber-input),
:deep(.p-calendar) {
  width: 100%;
  border-radius: 0.6rem;
}

/* Acciones */
.config-actions {
  display: flex;
  gap: 0.75rem;
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
  .config-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .config-actions {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>
