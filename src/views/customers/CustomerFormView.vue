<template>
  <div>
    <h2 class="mb-3">
      {{ isEdit ? 'Editar cliente' : 'Nuevo cliente' }}
    </h2>

    <div class="grid">
      <!-- Columna izquierda -->
      <div class="col-12 lg:col-6 flex flex-column gap-4">
        <section>
          <h3 class="mb-2">Datos personales</h3>
          <div class="flex flex-column gap-3">
            <div class="flex gap-2">
              <div class="flex flex-column gap-2 w-6">
                <label for="documentType">Tipo de documento</label>
                <Dropdown
                    id="documentType"
                    v-model="form.documentType"
                    :options="documentTypeOptions"
                    option-label="label"
                    option-value="value"
                    placeholder="Selecciona tipo"
                />
              </div>
              <div class="flex flex-column gap-2 w-6">
                <label for="documentNumber">Número de documento</label>
                <InputText id="documentNumber" v-model="form.documentNumber" />
              </div>
            </div>

            <div class="flex flex-column gap-2">
              <label for="fullName">Nombre completo</label>
              <InputText id="fullName" v-model="form.fullName" />
            </div>

            <div class="flex gap-2">
              <div class="flex flex-column gap-2 w-6">
                <label for="birthDate">Fecha de nacimiento</label>
                <Calendar
                    id="birthDate"
                    v-model="form.birthDate"
                    date-format="dd/mm/yy"
                    show-icon
                />
              </div>

              <div class="flex flex-column gap-2 w-6">
                <label for="maritalStatus">Estado civil</label>
                <Dropdown
                    id="maritalStatus"
                    v-model="form.maritalStatus"
                    :options="maritalStatusOptions"
                    option-label="label"
                    option-value="value"
                    placeholder="Selecciona estado"
                />
              </div>
            </div>

            <div class="flex flex-column gap-2 w-4">
              <label for="dependents">Dependientes</label>
              <InputNumber
                  id="dependents"
                  v-model="form.dependents"
                  :min="0"
                  show-buttons
              />
            </div>
          </div>
        </section>

        <section>
          <h3 class="mb-2">Contacto</h3>
          <div class="flex flex-column gap-3">
            <div class="flex flex-column gap-2">
              <label for="email">Correo electrónico</label>
              <InputText id="email" v-model="form.email" />
            </div>
            <div class="flex flex-column gap-2">
              <label for="phone">Teléfono</label>
              <InputText id="phone" v-model="form.phone" />
            </div>
            <div class="flex flex-column gap-2">
              <label for="city">Ciudad</label>
              <InputText id="city" v-model="form.city" />
            </div>
            <div class="flex flex-column gap-2">
              <label for="address">Dirección</label>
              <InputText id="address" v-model="form.address" />
            </div>
          </div>
        </section>
      </div>

      <!-- Columna derecha -->
      <div class="col-12 lg:col-6 flex flex-column gap-4">
        <section>
          <h3 class="mb-2">Información laboral</h3>
          <div class="flex flex-column gap-3">
            <div class="flex flex-column gap-2">
              <label for="employmentType">Tipo de empleo</label>
              <Dropdown
                  id="employmentType"
                  v-model="form.employmentType"
                  :options="employmentTypeOptions"
                  option-label="label"
                  option-value="value"
                  placeholder="Selecciona tipo"
              />
            </div>
            <div class="flex flex-column gap-2">
              <label for="employerName">Empresa / negocio</label>
              <InputText id="employerName" v-model="form.employerName" />
            </div>
            <div class="flex flex-column gap-2">
              <label for="jobPosition">Cargo</label>
              <InputText id="jobPosition" v-model="form.jobPosition" />
            </div>
          </div>
        </section>

        <section>
          <h3 class="mb-2">Información económica</h3>
          <div class="flex flex-column gap-3">
            <div class="flex flex-column gap-2">
              <label for="monthlyIncome">Ingreso mensual principal</label>
              <InputNumber
                  id="monthlyIncome"
                  v-model="form.monthlyIncome"
                  mode="currency"
                  currency="PEN"
                  locale="es-PE"
              />
            </div>

            <div class="flex flex-column gap-2">
              <label for="otherIncome">Otros ingresos mensuales</label>
              <InputNumber
                  id="otherIncome"
                  v-model="form.otherIncome"
                  mode="currency"
                  currency="PEN"
                  locale="es-PE"
              />
            </div>

            <div class="flex flex-column gap-2">
              <label for="fixedExpenses">Gastos fijos mensuales</label>
              <InputNumber
                  id="fixedExpenses"
                  v-model="form.fixedExpenses"
                  mode="currency"
                  currency="PEN"
                  locale="es-PE"
              />
            </div>
          </div>
        </section>
      </div>
    </div>

    <div class="mt-3 flex gap-2">
      <Button label="Guardar" icon="pi pi-save" @click="onSave" />
      <Button label="Cancelar" text @click="goBack" />
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

// Mapeo a lo que espera el backend
function mapFormToPayload() {
  return {
    id: form.id ?? 0,
    documentType: form.documentType,
    documentNumber: form.documentNumber,
    fullName: form.fullName,
    birthDate: form.birthDate,           // Date -> se serializa a ISO automático
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

