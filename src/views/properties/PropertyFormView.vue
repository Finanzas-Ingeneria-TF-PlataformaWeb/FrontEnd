<template>
  <div class="property-form-page">
    <!-- Header -->
    <div class="form-header">
      <div>
        <h2 class="form-title">
          {{ isEdit ? 'Editar unidad inmobiliaria' : 'Nueva unidad inmobiliaria' }}
        </h2>
        <p class="form-subtitle">
          Completa la ficha de la unidad para que el simulador MiVivienda pueda evaluar el crédito.
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
          <h3 class="section-title">Proyecto y ubicación</h3>
          <div class="section-body flex flex-column gap-3">
            <div class="flex flex-column gap-2">
              <label for="projectName" class="field-label required">Proyecto</label>
              <InputText
                  id="projectName"
                  v-model="form.projectName"
                  placeholder="Ej: Residencial Los Álamos"
              />
            </div>

            <div class="flex gap-2">
              <div class="flex flex-column gap-2 w-6">
                <label for="tower" class="field-label">Torre / bloque</label>
                <InputText
                    id="tower"
                    v-model="form.tower"
                    placeholder="Ej: Torre A"
                />
              </div>
              <div class="flex flex-column gap-2 w-6">
                <label for="floor" class="field-label">Piso</label>
                <InputNumber
                    id="floor"
                    v-model="form.floor"
                    :min="1"
                    show-buttons
                />
              </div>
            </div>

            <div class="flex flex-column gap-2">
              <label for="code" class="field-label required">Código de unidad</label>
              <InputText
                  id="code"
                  v-model="form.code"
                  placeholder="Ej: D101, C-302, OF-201"
              />
              <small class="field-help">
                Usa una nomenclatura consistente para facilitar la búsqueda en el inventario.
              </small>
            </div>
          </div>
        </section>

        <section class="form-section">
          <h3 class="section-title">Características del inmueble</h3>
          <div class="section-body flex flex-column gap-3">
            <div class="flex flex-column gap-2">
              <label for="propertyType" class="field-label required">Tipo de unidad</label>
              <Dropdown
                  id="propertyType"
                  v-model="form.propertyType"
                  :options="propertyTypeOptions"
                  option-label="label"
                  option-value="value"
                  placeholder="Selecciona tipo"
                  class="w-full"
              />
            </div>

            <div class="flex gap-2">
              <div class="flex flex-column gap-2 w-6">
                <label for="area" class="field-label">Área techada (m²)</label>
                <InputNumber
                    id="area"
                    v-model="form.area"
                    :minFractionDigits="0"
                    :maxFractionDigits="2"
                    placeholder="Ej: 75"
                />
              </div>
              <div class="flex flex-column gap-2 w-6">
                <label for="areaTotal" class="field-label">Área total (m²)</label>
                <InputNumber
                    id="areaTotal"
                    v-model="form.areaTotal"
                    :minFractionDigits="0"
                    :maxFractionDigits="2"
                    placeholder="Ej: 95"
                />
              </div>
            </div>

            <div class="flex gap-2">
              <div class="flex flex-column gap-2 w-4">
                <label for="bedrooms" class="field-label">Dormitorios</label>
                <InputNumber
                    id="bedrooms"
                    v-model="form.bedrooms"
                    :min="0"
                    show-buttons
                />
              </div>
              <div class="flex flex-column gap-2 w-4">
                <label for="bathrooms" class="field-label">Baños</label>
                <InputNumber
                    id="bathrooms"
                    v-model="form.bathrooms"
                    :min="0"
                    show-buttons
                />
              </div>
              <div class="flex flex-column gap-2 w-4">
                <label for="parkings" class="field-label">Estacionamientos</label>
                <InputNumber
                    id="parkings"
                    v-model="form.parkings"
                    :min="0"
                    show-buttons
                />
              </div>
            </div>
          </div>
        </section>
      </div>

      <!-- Columna derecha -->
      <div class="col-12 lg:col-6 flex flex-column gap-4">
        <section class="form-section">
          <h3 class="section-title">Precio y financiamiento base</h3>
          <div class="section-body flex flex-column gap-3">
            <div class="flex gap-2">
              <div class="flex flex-column gap-2 w-4">
                <label for="currency" class="field-label required">Moneda</label>
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
                <label for="price" class="field-label required">Precio de venta</label>
                <InputNumber
                    id="price"
                    v-model="form.price"
                    mode="currency"
                    :currency="form.currency || 'PEN'"
                    locale="es-PE"
                    placeholder="Monto de venta"
                />
              </div>
            </div>

            <div class="flex flex-column gap-2 w-6">
              <label for="minDownPaymentPercent" class="field-label">
                Cuota inicial mínima (%)
              </label>
              <InputNumber
                  id="minDownPaymentPercent"
                  v-model="form.minDownPaymentPercent"
                  :min="0"
                  :max="100"
                  suffix="%"
              />
              <small class="field-help">
                Este valor se usará como referencia en las simulaciones.
              </small>
            </div>

            <div class="flex flex-column gap-2">
              <label for="notes" class="field-label">Notas internas</label>
              <InputText
                  id="notes"
                  v-model="form.notes"
                  placeholder="Información relevante para el asesor (vista, acabados, condiciones especiales)."
              />
            </div>
          </div>
        </section>

        <section class="form-section">
          <h3 class="section-title">Imágenes de la unidad</h3>
          <div class="section-body flex flex-column gap-3">
            <div class="flex flex-column gap-2">
              <label for="imageFile" class="field-label">Imagen principal</label>
              <input
                  id="imageFile"
                  type="file"
                  accept="image/*"
                  class="file-input"
                  @change="onImageSelected"
              />
              <small class="field-help">
                Se recomienda usar imágenes horizontales de buena calidad para una mejor presentación al cliente.
              </small>
            </div>

            <div v-if="imagePreviewUrl" class="mt-1">
              <img
                  :src="imagePreviewUrl"
                  alt="Previsualización de unidad"
                  class="property-image-preview"
              />
            </div>
          </div>
        </section>
      </div>
    </div>

    <!-- Acciones -->
    <div class="form-actions mt-3">
      <Button
          label="Guardar unidad"
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
import { reactive, computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'

import {
  getProperty,
  createProperty,
  updateProperty,
  uploadPropertyImage
} from '@/api/propertiesApi'

const route = useRoute()
const router = useRouter()
const toast = useToast()

const imagePreviewUrl = ref(null)

const form = reactive({
  id: null,
  projectName: '',
  tower: '',
  floor: null,
  code: '',
  propertyType: null,
  area: null,
  areaTotal: null,
  bedrooms: 0,
  bathrooms: 0,
  parkings: 0,
  currency: 'PEN',
  price: null,
  minDownPaymentPercent: 10,
  notes: '',
  imageUrl: '',
  imageFile: null,
  createdAt: null
})

const isEdit = computed(() => !!route.params.id)

const propertyTypeOptions = [
  { label: 'Departamento', value: 'apartment' },
  { label: 'Casa', value: 'house' },
  { label: 'Dúplex', value: 'duplex' },
  { label: 'Loft', value: 'loft' },
  { label: 'Oficina', value: 'office' }
]

const currencyOptions = [
  { label: 'Soles (PEN)', value: 'PEN' },
  { label: 'Dólares (USD)', value: 'USD' }
]

function goBack() {
  router.push({ name: 'properties' })
}

function validateRequired() {
  const requiredFields = [
    { value: form.projectName, label: 'Proyecto' },
    { value: form.code, label: 'Código de unidad' },
    { value: form.propertyType, label: 'Tipo de unidad' },
    { value: form.currency, label: 'Moneda' },
    { value: form.price, label: 'Precio de venta' }
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

function onImageSelected(event) {
  const file = event.target.files && event.target.files[0]
  if (!file) {
    form.imageFile = null
    imagePreviewUrl.value = null
    return
  }

  form.imageFile = file

  if (imagePreviewUrl.value && imagePreviewUrl.value.startsWith('blob:')) {
    URL.revokeObjectURL(imagePreviewUrl.value)
  }

  imagePreviewUrl.value = URL.createObjectURL(file)
}

async function onSave() {
  if (!validateRequired()) {
    return
  }

  const payload = {
    id: isEdit.value ? form.id : 0,
    code: form.code,
    name: form.projectName || `Unidad ${form.code}`,
    address: form.notes || 'Sin dirección definida',
    district: form.tower || 'Lima',
    price: form.price ?? 0,
    currency: form.currency,
    areaM2: form.areaTotal ?? form.area ?? 0,
    bedrooms: form.bedrooms ?? 0,
    bathrooms: form.bathrooms ?? 0,
    imageUrl: form.imageUrl || '',
    propertyType: form.propertyType,
    createdAt: form.createdAt || new Date().toISOString()
  }

  try {
    let savedProperty

    if (isEdit.value) {
      const { data } = await updateProperty(form.id, payload)
      savedProperty = data
    } else {
      const { data } = await createProperty(payload)
      savedProperty = data
      form.id = data.id
    }

    if (form.imageFile && savedProperty?.id) {
      try {
        const { data: imgResponse } = await uploadPropertyImage(
            savedProperty.id,
            form.imageFile
        )

        form.imageUrl = imgResponse.imageUrl
        imagePreviewUrl.value = imgResponse.imageUrl

        toast.add({
          severity: 'info',
          summary: 'Imagen subida',
          detail: 'La imagen de la unidad se guardó correctamente.',
          life: 2500
        })
      } catch (uploadError) {
        console.error('Error al subir imagen', uploadError)
        toast.add({
          severity: 'warn',
          summary: 'Unidad guardada sin imagen',
          detail: 'La unidad se guardó, pero hubo un problema subiendo la imagen.',
          life: 4000
        })
      }
    }

    toast.add({
      severity: 'success',
      summary: isEdit.value ? 'Unidad actualizada' : 'Unidad creada',
      detail: 'La unidad inmobiliaria se guardó correctamente.',
      life: 3000
    })

    goBack()
  } catch (error) {
    console.error('Error al guardar propiedad', error)
    console.log('Detalle backend:', error?.response?.data)
    toast.add({
      severity: 'error',
      summary: 'Error al guardar',
      detail:
          error?.response?.data?.title ||
          error?.response?.data?.message ||
          'No se pudo guardar la unidad inmobiliaria.',
      life: 4000
    })
  }
}

onMounted(async () => {
  if (!isEdit.value) {
    form.createdAt = new Date().toISOString()
    imagePreviewUrl.value = null
    return
  }

  try {
    const { data } = await getProperty(route.params.id)

    form.id = data.id
    form.projectName = data.name
    form.code = data.code
    form.tower = data.district
    form.notes = data.address
    form.area = Number(data.areaM2)
    form.areaTotal = Number(data.areaM2)
    form.bedrooms = data.bedrooms
    form.bathrooms = data.bathrooms
    form.currency = data.currency
    form.price = Number(data.price)
    form.propertyType = data.propertyType || null
    form.parkings = 0
    form.minDownPaymentPercent = 10
    form.createdAt = data.createdAt
    form.imageUrl = data.imageUrl
    imagePreviewUrl.value = data.imageUrl || null
  } catch (error) {
    console.error('Error al cargar unidad', error)
    toast.add({
      severity: 'error',
      summary: 'Error al cargar',
      detail:
          error?.response?.data?.title ||
          error?.response?.data?.message ||
          'No se pudo cargar la unidad seleccionada.',
      life: 4000
    })
    goBack()
  }
})
</script>

<style scoped>
.property-form-page {
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

/* Unificar inputs de PrimeVue */
:deep(.p-inputtext),
:deep(.p-dropdown),
:deep(.p-inputnumber-input) {
  width: 100%;
  border-radius: 0.6rem;
}

/* File input */
.file-input {
  padding: 0.45rem 0.75rem;
  border-radius: 0.6rem;
  border: 1px dashed #d1d5db;
  background-color: #f9fafb;
  font-size: 0.8rem;
  cursor: pointer;
}

.file-input:hover {
  background-color: #f3f4f6;
}

/* Imagen */
.property-image-preview {
  max-width: 100%;
  max-height: 240px;
  border-radius: 0.75rem;
  object-fit: cover;
  box-shadow: 0 2px 10px rgba(15, 23, 42, 0.25);
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
