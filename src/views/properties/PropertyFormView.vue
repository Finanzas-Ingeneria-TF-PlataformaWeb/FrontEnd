<template>
  <div>
    <h2 class="mb-3">
      {{ isEdit ? 'Editar unidad inmobiliaria' : 'Nueva unidad inmobiliaria' }}
    </h2>

    <div class="grid">
      <!-- Columna izquierda -->
      <div class="col-12 lg:col-6 flex flex-column gap-4">
        <section>
          <h3 class="mb-2">Proyecto y ubicación</h3>
          <div class="flex flex-column gap-3">
            <div class="flex flex-column gap-2">
              <label for="projectName">Proyecto</label>
              <InputText id="projectName" v-model="form.projectName" />
            </div>

            <div class="flex gap-2">
              <div class="flex flex-column gap-2 w-6">
                <label for="tower">Torre / bloque</label>
                <InputText id="tower" v-model="form.tower" />
              </div>
              <div class="flex flex-column gap-2 w-6">
                <label for="floor">Piso</label>
                <InputNumber
                    id="floor"
                    v-model="form.floor"
                    :min="1"
                    show-buttons
                />
              </div>
            </div>

            <div class="flex flex-column gap-2">
              <label for="code">Código de unidad</label>
              <InputText
                  id="code"
                  v-model="form.code"
                  placeholder="Ej: D101, C-302, etc."
              />
            </div>
          </div>
        </section>

        <section>
          <h3 class="mb-2">Características del inmueble</h3>
          <div class="flex flex-column gap-3">
            <div class="flex flex-column gap-2">
              <label for="propertyType">Tipo de unidad</label>
              <Dropdown
                  id="propertyType"
                  v-model="form.propertyType"
                  :options="propertyTypeOptions"
                  option-label="label"
                  option-value="value"
                  placeholder="Selecciona tipo"
              />
            </div>

            <div class="flex gap-2">
              <div class="flex flex-column gap-2 w-6">
                <label for="area">Área techada (m²)</label>
                <InputNumber
                    id="area"
                    v-model="form.area"
                    :minFractionDigits="0"
                    :maxFractionDigits="2"
                />
              </div>
              <div class="flex flex-column gap-2 w-6">
                <label for="areaTotal">Área total (m²)</label>
                <InputNumber
                    id="areaTotal"
                    v-model="form.areaTotal"
                    :minFractionDigits="0"
                    :maxFractionDigits="2"
                />
              </div>
            </div>

            <div class="flex gap-2">
              <div class="flex flex-column gap-2 w-4">
                <label for="bedrooms">Dormitorios</label>
                <InputNumber
                    id="bedrooms"
                    v-model="form.bedrooms"
                    :min="0"
                    show-buttons
                />
              </div>
              <div class="flex flex-column gap-2 w-4">
                <label for="bathrooms">Baños</label>
                <InputNumber
                    id="bathrooms"
                    v-model="form.bathrooms"
                    :min="0"
                    show-buttons
                />
              </div>
              <div class="flex flex-column gap-2 w-4">
                <label for="parkings">Estacionamientos</label>
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
        <section>
          <h3 class="mb-2">Precio y financiamiento base</h3>
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
                <label for="price">Precio de venta</label>
                <InputNumber
                    id="price"
                    v-model="form.price"
                    mode="currency"
                    :currency="form.currency || 'PEN'"
                    locale="es-PE"
                />
              </div>
            </div>

            <div class="flex flex-column gap-2 w-6">
              <label for="minDownPaymentPercent">
                Cuota inicial mínima (%)
              </label>
              <InputNumber
                  id="minDownPaymentPercent"
                  v-model="form.minDownPaymentPercent"
                  :min="0"
                  :max="100"
                  suffix="%"
              />
            </div>

            <div class="flex flex-column gap-2">
              <label for="notes">Notas internas</label>
              <InputText
                  id="notes"
                  v-model="form.notes"
                  placeholder="Información relevante para el asesor."
              />
            </div>
          </div>
        </section>

        <section>
          <h3 class="mb-2">Imágenes de la unidad</h3>
          <div class="flex flex-column gap-3">
            <div class="flex flex-column gap-2">
              <label for="imageFile">Imagen principal</label>
              <input
                  id="imageFile"
                  type="file"
                  accept="image/*"
                  @change="onImageSelected"
              />
              <small class="text-sm">
                La imagen se previsualiza localmente y luego se sube al backend
                al guardar la unidad.
              </small>
            </div>

            <div v-if="imagePreviewUrl" class="mt-2">
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

    <div class="mt-3 flex gap-2">
      <Button label="Guardar" icon="pi pi-save" @click="onSave" />
      <Button label="Cancelar" text @click="goBack" />
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

  // Liberar URL anterior si era un blob temporal
  if (imagePreviewUrl.value && imagePreviewUrl.value.startsWith('blob:')) {
    URL.revokeObjectURL(imagePreviewUrl.value)
  }

  imagePreviewUrl.value = URL.createObjectURL(file)
}

async function onSave() {
  if (!validateRequired()) {
    return
  }

  // Payload JSON para el backend (sin archivo)
  const payload = {
    id: form.id || 0,
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

    // Si el usuario seleccionó una imagen, se sube al endpoint /properties/{id}/image
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
          detail:
              'La unidad se guardó, pero hubo un problema subiendo la imagen.',
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
    form.propertyType = 'apartment'
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
.property-image-preview {
  max-width: 100%;
  max-height: 240px;
  border-radius: 0.75rem;
  object-fit: cover;
  box-shadow: 0 2px 10px rgba(15, 23, 42, 0.25);
}
</style>
