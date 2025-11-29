<template>
  <div>
    <h2 class="mb-3">Configurar simulación</h2>

    <div class="grid">
      <!-- Columna izquierda -->
      <div class="col-12 lg:col-6 flex flex-column gap-4">
        <section>
          <h3 class="mb-2">Cliente e inmueble</h3>

          <div class="flex flex-column gap-3">
            <div class="flex flex-column gap-2">
              <label for="customer">Cliente</label>
              <Dropdown
                  id="customer"
                  v-model="form.customerId"
                  :options="customers"
                  option-label="label"
                  option-value="id"
                  placeholder="Selecciona un cliente"
                  :loading="loadingCustomers"
              />
            </div>

            <div class="flex flex-column gap-2">
              <label for="property">Unidad inmobiliaria</label>
              <Dropdown
                  id="property"
                  v-model="form.propertyId"
                  :options="properties"
                  option-label="label"
                  option-value="id"
                  placeholder="Selecciona una unidad"
                  :loading="loadingProperties"
              />
            </div>
          </div>
        </section>

        <section>
          <h3 class="mb-2">Monto y plazo del crédito</h3>

          <div class="flex flex-column gap-3">
            <div class="flex gap-2">
              <div class="flex flex-column gap-2 w-4">
                <label for="currency">Moneda</label>
                <Dropdown
                    id="currency"
                    v-model="form.currency"
                    :options="currencyOptions"
                    option-label="label"
                    option-value="value"
                    placeholder="Selecciona moneda"
                />
              </div>

              <div class="flex flex-column gap-2 w-8">
                <label for="loanAmount">Monto del préstamo</label>
                <InputNumber
                    id="loanAmount"
                    v-model="form.loanAmount"
                    mode="currency"
                    :currency="form.currency || 'PEN'"
                    locale="es-PE"
                />
              </div>
            </div>

            <div class="flex gap-2">
              <div class="flex flex-column gap-2 w-6">
                <label for="startDate">Fecha de desembolso</label>
                <Calendar
                    id="startDate"
                    v-model="form.startDate"
                    date-format="dd/mm/yy"
                    show-icon
                />
              </div>

              <div class="flex flex-column gap-2 w-6">
                <label for="termYears">Plazo (años)</label>
                <InputNumber
                    id="termYears"
                    v-model="form.termYears"
                    :min="1"
                    :max="30"
                    show-buttons
                />
                <small class="text-sm">
                  Aproximadamente {{ form.termYears * 12 }} cuotas mensuales.
                </small>
              </div>
            </div>
          </div>
        </section>
      </div>

      <!-- Columna derecha -->
      <div class="col-12 lg:col-6 flex flex-column gap-4">
        <section>
          <h3 class="mb-2">Tasa de interés</h3>

          <div class="flex flex-column gap-3">
            <div class="flex flex-column gap-2">
              <label for="rateType">Tipo de tasa</label>
              <Dropdown
                  id="rateType"
                  v-model="form.rateType"
                  :options="rateTypeOptions"
                  option-label="label"
                  option-value="value"
                  placeholder="Selecciona tipo de tasa"
              />
            </div>

            <div class="flex flex-column gap-2">
              <label for="annualRate">
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
              />
            </div>

            <div
                v-if="form.rateType === 'nominal'"
                class="flex flex-column gap-2"
            >
              <label for="capitalization">
                Capitalización
              </label>
              <Dropdown
                  id="capitalization"
                  v-model="form.capitalization"
                  :options="capitalizationOptions"
                  option-label="label"
                  option-value="value"
                  placeholder="Selecciona frecuencia"
              />
            </div>
          </div>
        </section>

        <section>
          <h3 class="mb-2">Periodo de gracia y bono</h3>

          <div class="flex flex-column gap-3">
            <div class="flex gap-2">
              <div class="flex flex-column gap-2 w-6">
                <label for="graceType">
                  Tipo de gracia
                </label>
                <Dropdown
                    id="graceType"
                    v-model="form.graceType"
                    :options="graceTypeOptions"
                    option-label="label"
                    option-value="value"
                    placeholder="Sin periodo de gracia"
                />
              </div>

              <div
                  class="flex flex-column gap-2 w-6"
                  v-if="form.graceType !== 'none'"
              >
                <label for="graceMonths">
                  Meses de gracia
                </label>
                <InputNumber
                    id="graceMonths"
                    v-model="form.graceMonths"
                    :min="0"
                    :max="24"
                    show-buttons
                />
              </div>
            </div>

            <div class="flex flex-column gap-2">
              <label for="subsidyAmount">
                Bono / subsidio MiVivienda (opcional)
              </label>
              <InputNumber
                  id="subsidyAmount"
                  v-model="form.subsidyAmount"
                  mode="currency"
                  :currency="form.currency || 'PEN'"
                  locale="es-PE"
              />
              <small class="text-sm">
                Si el cliente aplica a bono, ingresa el monto que se
                resta al precio de venta.
              </small>
            </div>
          </div>
        </section>
      </div>
    </div>

    <div class="mt-3 flex gap-2">
      <Button
          label="Calcular plan de pagos"
          icon="pi pi-calculator"
          :loading="loading"
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

    // Para ver en consola exactamente qué está devolviendo el backend
    console.log('Respuesta POST /simulations:', data)

    // Aceptamos { simulationId: 1 } o { id: 1 }
    const simulationId = data?.simulationId ?? data?.id

    if (!simulationId && simulationId !== 0) {
      // No hay id => no intentamos hacer router.push
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

    // Navegamos SOLO si tenemos id válido
    await router.push({
      name: 'simulations-result',
      params: { id: String(simulationId) } // lo pasamos como string
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

