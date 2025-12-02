<template>
  <div class="customer-form-page">
    <!-- Header -->
    <div class="form-header">
      <div>
        <h2 class="form-title">
          {{ isEdit ? 'Editar cliente' : 'Nuevo cliente' }}
        </h2>
        <p class="form-subtitle">
          Registra la información del solicitante para evaluar su perfil crediticio.
        </p>
      </div>

      <div class="form-badge" v-if="isEdit">
        <span class="badge-dot"></span>
        Modo edición
      </div>
    </div>

    <!-- Grid principal -->
    <div class="grid form-grid">
      <!-- Columna izquierda -->
      <div class="col-12 lg:col-6 flex flex-column gap-4">
        <section class="form-section">
          <h3 class="section-title">Datos personales</h3>
          <div class="section-body flex flex-column gap-3">
            <div class="flex gap-2">
              <div class="flex flex-column gap-2 w-6">
                <label for="documentType" class="field-label required">
                  Tipo de documento
                </label>
                <Dropdown
                    id="documentType"
                    v-model="form.documentType"
                    :options="documentTypeOptions"
                    option-label="label"
                    option-value="value"
                    placeholder="Selecciona tipo"
                    class="w-full"
                />
              </div>
              <div class="flex flex-column gap-2 w-6">
                <label for="documentNumber" class="field-label required">
                  Número de documento
                </label>
                <InputText
                    id="documentNumber"
                    v-model="form.documentNumber"
                    placeholder="Ej: 12345678"
                />
              </div>
            </div>

            <div class="flex flex-column gap-2">
              <label for="fullName" class="field-label required">
                Nombre completo
              </label>
              <InputText
                  id="fullName"
                  v-model="form.fullName"
                  placeholder="Ej: Juan Pérez García"
              />
            </div>

            <div class="flex gap-2">
              <div class="flex flex-column gap-2 w-6">
                <label for="birthDate" class="field-label">
                  Fecha de nacimiento
                </label>
                <Calendar
                    id="birthDate"
                    v-model="form.birthDate"
                    date-format="dd/mm/yy"
                    show-icon
                    class="w-full"
                />
              </div>

              <div class="flex flex-column gap-2 w-6">
                <label for="maritalStatus" class="field-label required">
                  Estado civil
                </label>
                <Dropdown
                    id="maritalStatus"
                    v-model="form.maritalStatus"
                    :options="maritalStatusOptions"
                    option-label="label"
                    option-value="value"
                    placeholder="Selecciona estado"
                    class="w-full"
                />
              </div>
            </div>

            <div class="flex flex-column gap-2 w-4">
              <label for="dependents" class="field-label">
                Dependientes
              </label>
              <InputNumber
                  id="dependents"
                  v-model="form.dependents"
                  :min="0"
                  show-buttons
              />
              <small class="field-help">
                Número de personas que dependen económicamente del cliente.
              </small>
            </div>
          </div>
        </section>

        <section class="form-section">
          <h3 class="section-title">Contacto</h3>
          <div class="section-body flex flex-column gap-3">
            <div class="flex flex-column gap-2">
              <label for="email" class="field-label">
                Correo electrónico
              </label>
              <InputText
                  id="email"
                  v-model="form.email"
                  placeholder="Ej: cliente@correo.com"
              />
            </div>
            <div class="flex flex-column gap-2">
              <label for="phone" class="field-label">
                Teléfono
              </label>
              <InputText
                  id="phone"
                  v-model="form.phone"
                  placeholder="Ej: 999 999 999"
              />
            </div>
            <div class="flex flex-column gap-2">
              <label for="city" class="field-label">
                Ciudad
              </label>
              <InputText
                  id="city"
                  v-model="form.city"
                  placeholder="Ej: Lima"
              />
            </div>
            <div class="flex flex-column gap-2">
              <label for="address" class="field-label">
                Dirección
              </label>
              <InputText
                  id="address"
                  v-model="form.address"
                  placeholder="Calle, número, urbanización, referencia"
              />
            </div>
          </div>
        </section>
      </div>

      <!-- Columna derecha -->
      <div class="col-12 lg:col-6 flex flex-column gap-4">
        <section class="form-section">
          <h3 class="section-title">Información laboral</h3>
          <div class="section-body flex flex-column gap-3">
            <div class="flex flex-column gap-2">
              <label for="employmentType" class="field-label">
                Tipo de empleo
              </label>
              <Dropdown
                  id="employmentType"
                  v-model="form.employmentType"
                  :options="employmentTypeOptions"
                  option-label="label"
                  option-value="value"
                  placeholder="Selecciona tipo"
                  class="w-full"
              />
            </div>
            <div class="flex flex-column gap-2">
              <label for="employerName" class="field-label">
                Empresa / negocio
              </label>
              <InputText
                  id="employerName"
                  v-model="form.employerName"
                  placeholder="Ej: Empresa ABC SAC"
              />
            </div>
            <div class="flex flex-column gap-2">
              <label for="jobPosition" class="field-label">
                Cargo
              </label>
              <InputText
                  id="jobPosition"
                  v-model="form.jobPosition"
                  placeholder="Ej: Analista, Jefe de ventas, Independiente"
              />
            </div>
          </div>
        </section>

        <section class="form-section">
          <h3 class="section-title">Información económica</h3>
          <div class="section-body flex flex-column gap-3">
            <div class="flex flex-column gap-2">
              <label for="monthlyIncome" class="field-label required">
                Ingreso mensual principal
              </label>
              <InputNumber
                  id="monthlyIncome"
                  v-model="form.monthlyIncome"
                  mode="currency"
                  currency="PEN"
                  locale="es-PE"
                  placeholder="Ej: 3,500.00"
              />
            </div>

            <div class="flex flex-column gap-2">
              <label for="otherIncome" class="field-label">
                Otros ingresos mensuales
              </label>
              <InputNumber
                  id="otherIncome"
                  v-model="form.otherIncome"
                  mode="currency"
                  currency="PEN"
                  locale="es-PE"
                  placeholder="Ej: 500.00"
              />
              <small class="field-help">
                Incluye negocios propios, alquileres, comisiones, etc.
              </small>
            </div>

            <div class="flex flex-column gap-2">
              <label for="fixedExpenses" class="field-label">
                Gastos fijos mensuales
              </label>
              <InputNumber
                  id="fixedExpenses"
                  v-model="form.fixedExpenses"
                  mode="currency"
                  currency="PEN"
                  locale="es-PE"
                  placeholder="Ej: 1,800.00"
              />
              <small class="field-help">
                Suma de alquiler, servicios, otros créditos, pensiones, etc.
              </small>
            </div>
          </div>
        </section>
      </div>
    </div>

    <!-- Acciones -->
    <div class="form-actions mt-3">
      <Button
          label="Guardar cliente"
          icon="pi pi-save"
          class="p-button-success"
          @click="onSave"
      />
      <Button
          label="Cancelar"
          text
          class="p-button-text"
          @click="goBack"
      />
    </div>
  </div>
</template>

<script setup>
import { reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import {
  getCustomer,
  createCustomer,
  updateCustomer
} from '@/api/customersApi'

const route = useRoute()
const router = useRouter()
const toast = useToast()

const form = reactive({
  id: null,
  documentType: 'dni',
  documentNumber: '',
  fullName: '',
  birthDate: null,
  maritalStatus: null,
  dependents: 0,
  email: '',
  phone: '',
  city: '',
  address: '',
  employmentType: null,
  employerName: '',
  jobPosition: '',
  monthlyIncome: null,
  otherIncome: null,
  fixedExpenses: null
})

const isEdit = computed(() => !!route.params.id)

const documentTypeOptions = [
  { label: 'DNI', value: 'dni' },
  { label: 'Carné de extranjería', value: 'ce' },
  { label: 'Pasaporte', value: 'passport' }
]

const maritalStatusOptions = [
  { label: 'Soltero(a)', value: 'single' },
  { label: 'Casado(a)', value: 'married' },
  { label: 'Conviviente', value: 'cohabitant' },
  { label: 'Divorciado(a)', value: 'divorced' },
  { label: 'Viudo(a)', value: 'widowed' }
]

const employmentTypeOptions = [
  { label: 'Dependiente', value: 'dependent' },
  { label: 'Independiente', value: 'independent' },
  { label: 'Mixto', value: 'mixed' },
  { label: 'Desempleado', value: 'unemployed' }
]

function goBack() {
  router.push({ name: 'customers' })
}

function validateRequired() {
  const requiredFields = [
    { value: form.documentType, label: 'Tipo de documento' },
    { value: form.documentNumber, label: 'Número de documento' },
    { value: form.fullName, label: 'Nombre completo' },
    { value: form.maritalStatus, label: 'Estado civil' },
    { value: form.monthlyIncome, label: 'Ingreso mensual principal' }
  ]

  const missing = requiredFields.filter((f) => !f.value)

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

function mapFormToPayload() {
  return {
    id: form.id ?? 0,
    documentType: form.documentType,
    documentNumber: form.documentNumber,
    fullName: form.fullName,
    birthDate: form.birthDate,
    maritalStatus: form.maritalStatus,
    dependents: form.dependents,
    email: form.email,
    phone: form.phone,
    city: form.city,
    address: form.address,
    employmentType: form.employmentType,
    employerName: form.employerName,
    jobPosition: form.jobPosition,
    monthlyIncome: form.monthlyIncome ?? 0,
    otherIncome: form.otherIncome ?? 0,
    fixedExpenses: form.fixedExpenses ?? 0
  }
}

async function onSave() {
  if (!validateRequired()) return

  try {
    const payload = mapFormToPayload()

    if (isEdit.value) {
      await updateCustomer(form.id, payload)
      toast.add({
        severity: 'success',
        summary: 'Cliente actualizado',
        detail: 'Los datos del cliente se actualizaron correctamente.',
        life: 3000
      })
    } else {
      const { data } = await createCustomer(payload)
      form.id = data.id
      toast.add({
        severity: 'success',
        summary: 'Cliente creado',
        detail: 'El cliente se registró correctamente.',
        life: 3000
      })
    }

    goBack()
  } catch (error) {
    console.error('Error al guardar cliente', error)
    toast.add({
      severity: 'error',
      summary: 'Error de guardado',
      detail:
          error?.response?.data?.title ||
          error?.response?.data?.message ||
          'Ocurrió un problema al guardar el cliente.',
      life: 4000
    })
  }
}

async function loadCustomer() {
  try {
    const { data } = await getCustomer(route.params.id)

    form.id = data.id
    form.documentType = data.documentType
    form.documentNumber = data.documentNumber
    form.fullName = data.fullName
    form.birthDate = data.birthDate ? new Date(data.birthDate) : null
    form.maritalStatus = data.maritalStatus
    form.dependents = data.dependents
    form.email = data.email
    form.phone = data.phone
    form.city = data.city
    form.address = data.address
    form.employmentType = data.employmentType
    form.employerName = data.employerName
    form.jobPosition = data.jobPosition
    form.monthlyIncome = data.monthlyIncome
    form.otherIncome = data.otherIncome
    form.fixedExpenses = data.fixedExpenses
  } catch (error) {
    console.error('Error al cargar cliente', error)
    toast.add({
      severity: 'error',
      summary: 'Error de carga',
      detail: 'No se pudo cargar el cliente.',
      life: 4000
    })
    goBack()
  }
}

onMounted(() => {
  if (isEdit.value) {
    loadCustomer()
  }
})
</script>

<style scoped>
.customer-form-page {
  animation: fadeIn 0.2s ease-out;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
}

.form-title {
  font-size: 1.3rem;
  font-weight: 600;
  color: #064e3b;
  margin-bottom: 0.25rem;
}

.form-subtitle {
  font-size: 0.85rem;
  color: #6b7280;
  margin: 0;
}

.form-badge {
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

.badge-dot {
  width: 6px;
  height: 6px;
  border-radius: 999px;
  background: #22c55e;
}

.form-grid {
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

.section-title {
  font-size: 0.95rem;
  font-weight: 600;
  color: #111827;
  margin-bottom: 0.75rem;
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

/* Inputs PrimeVue */
:deep(.p-inputtext),
:deep(.p-dropdown),
:deep(.p-inputnumber-input),
:deep(.p-calendar) {
  width: 100%;
  border-radius: 0.6rem;
}

/* Acciones */
.form-actions {
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
  .form-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .form-actions {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>
