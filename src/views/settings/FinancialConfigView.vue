<template>
  <div>
    <h2 class="mb-2">Configuración financiera</h2>
    <p class="text-sm text-600 mb-4">
      Define los parámetros por defecto que usarán las simulaciones de crédito MiVivienda.
    </p>

    <div class="grid">
      <!-- Parámetros generales -->
      <div class="col-12 lg:col-6">
        <Card>
          <template #title>Parámetros generales</template>
          <template #content>
            <div class="flex flex-column gap-3">
              <div class="flex flex-column gap-2">
                <span class="text-sm font-medium">Monedas permitidas</span>
                <div class="flex align-items-center gap-4">
                  <div class="flex align-items-center gap-2">
                    <Checkbox
                        input-id="allowPEN"
                        v-model="form.general.allowPEN"
                        :binary="true"
                    />
                    <label for="allowPEN">Soles (PEN)</label>
                  </div>
                  <div class="flex align-items-center gap-2">
                    <Checkbox
                        input-id="allowUSD"
                        v-model="form.general.allowUSD"
                        :binary="true"
                    />
                    <label for="allowUSD">Dólares (USD)</label>
                  </div>
                </div>
                <small class="text-xs text-600">
                  Estas son las monedas disponibles al configurar una simulación.
                </small>
              </div>

              <div class="flex flex-column gap-2 w-8">
                <label for="defaultCurrency" class="text-sm font-medium">
                  Moneda por defecto
                </label>
                <Dropdown
                    id="defaultCurrency"
                    v-model="form.general.defaultCurrency"
                    :options="currencyOptions"
                    option-label="label"
                    option-value="value"
                    placeholder="Selecciona moneda"
                />
              </div>
            </div>
          </template>
        </Card>
      </div>

      <!-- Tasas de interés -->
      <div class="col-12 lg:col-6">
        <Card>
          <template #title>Tasas de interés</template>
          <template #content>
            <div class="flex flex-column gap-3">
              <div class="flex flex-column gap-2 w-10">
                <label for="rateType" class="text-sm font-medium">
                  Tipo de tasa por defecto
                </label>
                <Dropdown
                    id="rateType"
                    v-model="form.rates.defaultRateType"
                    :options="rateTypeOptions"
                    option-label="label"
                    option-value="value"
                    placeholder="Selecciona tipo de tasa"
                />
              </div>

              <div class="flex gap-3">
                <div class="flex flex-column gap-2 w-6">
                  <label for="tea" class="text-sm font-medium">
                    TEA por defecto
                  </label>
                  <InputNumber
                      id="tea"
                      v-model="form.rates.defaultEffectiveAnnualRate"
                      :minFractionDigits="2"
                      :maxFractionDigits="4"
                      suffix="%"
                  />
                  <small class="text-xs text-600">
                    Tasa efectiva anual utilizada cuando se seleccione TEA.
                  </small>
                </div>

                <div class="flex flex-column gap-2 w-6">
                  <label for="tna" class="text-sm font-medium">
                    TNA por defecto
                  </label>
                  <InputNumber
                      id="tna"
                      v-model="form.rates.defaultNominalAnnualRate"
                      :minFractionDigits="2"
                      :maxFractionDigits="4"
                      suffix="%"
                  />
                  <small class="text-xs text-600">
                    Tasa nominal anual usada cuando el tipo de tasa sea TNA.
                  </small>
                </div>
              </div>

              <div class="flex flex-column gap-2 w-8">
                <label for="capitalization" class="text-sm font-medium">
                  Capitalización nominal por defecto
                </label>
                <Dropdown
                    id="capitalization"
                    v-model="form.rates.defaultNominalCapitalization"
                    :options="capitalizationOptions"
                    option-label="label"
                    option-value="value"
                    placeholder="Selecciona frecuencia"
                />
              </div>
            </div>
          </template>
        </Card>
      </div>

      <!-- Plazos y gracia -->
      <div class="col-12 lg:col-6">
        <Card class="mt-3 lg:mt-0">
          <template #title>Plazos y periodos de gracia</template>
          <template #content>
            <div class="flex flex-column gap-3">
              <div class="flex gap-3">
                <div class="flex flex-column gap-2 w-6">
                  <label for="minYears" class="text-sm font-medium">
                    Plazo mínimo (años)
                  </label>
                  <InputNumber
                      id="minYears"
                      v-model="form.terms.minYears"
                      :min="1"
                      :max="40"
                      show-buttons
                  />
                </div>

                <div class="flex flex-column gap-2 w-6">
                  <label for="maxYears" class="text-sm font-medium">
                    Plazo máximo (años)
                  </label>
                  <InputNumber
                      id="maxYears"
                      v-model="form.terms.maxYears"
                      :min="1"
                      :max="40"
                      show-buttons
                  />
                </div>
              </div>

              <div class="flex gap-3">
                <div class="flex flex-column gap-2 w-6">
                  <label for="maxTotalGrace" class="text-sm font-medium">
                    Máx. meses de gracia total
                  </label>
                  <InputNumber
                      id="maxTotalGrace"
                      v-model="form.terms.maxTotalGraceMonths"
                      :min="0"
                      :max="36"
                      show-buttons
                  />
                </div>

                <div class="flex flex-column gap-2 w-6">
                  <label for="maxPartialGrace" class="text-sm font-medium">
                    Máx. meses de gracia parcial
                  </label>
                  <InputNumber
                      id="maxPartialGrace"
                      v-model="form.terms.maxPartialGraceMonths"
                      :min="0"
                      :max="36"
                      show-buttons
                  />
                </div>
              </div>

              <small class="text-xs text-600">
                Estos límites se utilizarán para validar los parámetros de las simulaciones.
              </small>
            </div>
          </template>
        </Card>
      </div>

      <!-- Bono / subsidio -->
      <div class="col-12 lg:col-6">
        <Card class="mt-3 lg:mt-0">
          <template #title>Bono / subsidio MiVivienda</template>
          <template #content>
            <div class="flex flex-column gap-3">
              <div class="flex align-items-center justify-content-between">
                <div>
                  <span class="text-sm font-medium">
                    Permitir simulación con bono
                  </span>
                  <p class="text-xs text-600 m-0">
                    Activa o desactiva la opción de aplicar un bono al cliente.
                  </p>
                </div>
                <InputSwitch v-model="form.subsidy.allowed" />
              </div>

              <div class="flex gap-3" v-if="form.subsidy.allowed">
                <div class="flex flex-column gap-2 w-6">
                  <label for="minSubsidy" class="text-sm font-medium">
                    Monto mínimo de bono
                  </label>
                  <InputNumber
                      id="minSubsidy"
                      v-model="form.subsidy.minAmount"
                      mode="currency"
                      currency="PEN"
                      locale="es-PE"
                  />
                </div>

                <div class="flex flex-column gap-2 w-6">
                  <label for="maxSubsidy" class="text-sm font-medium">
                    Monto máximo de bono
                  </label>
                  <InputNumber
                      id="maxSubsidy"
                      v-model="form.subsidy.maxAmount"
                      mode="currency"
                      currency="PEN"
                      locale="es-PE"
                  />
                </div>
              </div>

              <small class="text-xs text-600">
                Esta configuración ayuda a controlar el rango típico del Bono del Buen Pagador o
                similares, según las políticas de la inmobiliaria.
              </small>
            </div>
          </template>
        </Card>
      </div>
    </div>

    <!-- Botones -->
    <div class="mt-4 flex gap-2">
      <Button
          label="Guardar configuración"
          icon="pi pi-save"
          :loading="saving"
          @click="onSave"
      />
      <Button
          label="Restaurar valores de fábrica"
          icon="pi pi-refresh"
          severity="secondary"
          text
          @click="onReset"
      />
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import { useToast } from 'primevue/usetoast'

import {
  getFinancialConfig,
  saveFinancialConfig,
  resetFinancialConfig
} from '@/api/configApi'

const toast = useToast()

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

const form = reactive({
  general: {
    defaultCurrency: 'PEN',
    allowPEN: true,
    allowUSD: true
  },
  rates: {
    defaultRateType: 'effective',
    defaultEffectiveAnnualRate: 10.5,
    defaultNominalAnnualRate: 11.0,
    defaultNominalCapitalization: 'monthly'
  },
  terms: {
    minYears: 5,
    maxYears: 25,
    maxTotalGraceMonths: 12,
    maxPartialGraceMonths: 24
  },
  subsidy: {
    allowed: true,
    minAmount: 0,
    maxAmount: 40000
  }
})

const loading = ref(false)
const saving = ref(false)

function applyConfig(config) {
  form.general.defaultCurrency = config.general.defaultCurrency
  form.general.allowPEN = config.general.allowPEN
  form.general.allowUSD = config.general.allowUSD

  form.rates.defaultRateType = config.rates.defaultRateType
  form.rates.defaultEffectiveAnnualRate = config.rates.defaultEffectiveAnnualRate
  form.rates.defaultNominalAnnualRate = config.rates.defaultNominalAnnualRate
  form.rates.defaultNominalCapitalization =
      config.rates.defaultNominalCapitalization

  form.terms.minYears = config.terms.minYears
  form.terms.maxYears = config.terms.maxYears
  form.terms.maxTotalGraceMonths = config.terms.maxTotalGraceMonths
  form.terms.maxPartialGraceMonths = config.terms.maxPartialGraceMonths

  form.subsidy.allowed = config.subsidy.allowed
  form.subsidy.minAmount = config.subsidy.minAmount
  form.subsidy.maxAmount = config.subsidy.maxAmount
}

async function loadConfig() {
  loading.value = true
  try {
    const response = await getFinancialConfig()
    applyConfig(response.data)
  } catch (error) {
    toast.add({
      severity: 'warn',
      summary: 'Configuración por defecto',
      detail: 'No se pudo leer la configuración, usando valores estándar.',
      life: 3000
    })
  } finally {
    loading.value = false
  }
}

async function onSave() {
  saving.value = true
  try {
    const payload = JSON.parse(JSON.stringify(form))
    const response = await saveFinancialConfig(payload)
    applyConfig(response.data)
    toast.add({
      severity: 'success',
      summary: 'Configuración guardada',
      detail: 'Los parámetros financieros se han actualizado.',
      life: 3000
    })
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Error al guardar',
      detail: 'No se pudo guardar la configuración.',
      life: 3000
    })
  } finally {
    saving.value = false
  }
}

async function onReset() {
  saving.value = true
  try {
    const response = await resetFinancialConfig()
    applyConfig(response.data)
    toast.add({
      severity: 'info',
      summary: 'Valores restaurados',
      detail: 'Se restauró la configuración financiera por defecto.',
      life: 3000
    })
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Error al restaurar',
      detail: 'No se pudo restaurar la configuración.',
      life: 3000
    })
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  loadConfig()
})
</script>
