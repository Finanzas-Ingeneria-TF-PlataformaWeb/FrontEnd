<template>
  <div>
    <div class="flex justify-content-between align-items-center mb-3">
      <h2 class="m-0">Unidades inmobiliarias</h2>
      <Button
          label="Nueva unidad"
          icon="pi pi-plus"
          @click="goNew"
      />
    </div>

    <DataTable
        :value="properties"
        paginator
        :rows="10"
        responsive-layout="scroll"
        :loading="loading"
        empty-message="No hay unidades registradas."
    >
      <Column header="Imagen">
        <template #body="slotProps">
          <img
              v-if="slotProps.data.imageUrl"
              :src="slotProps.data.imageUrl"
              alt="Unidad"
              class="w-3rem h-3rem border-round"
              style="object-fit: cover;"
          />
          <i v-else class="pi pi-image text-300" />
        </template>
      </Column>

      <Column field="code" header="Código" />
      <Column field="projectName" header="Proyecto" />
      <Column field="propertyTypeLabel" header="Tipo" />
      <Column field="area" header="Área (m²)" />
      <Column field="bedrooms" header="Dorm." />
      <Column field="bathrooms" header="Baños" />

      <Column
          field="price"
          header="Precio"
          :body="priceTemplate"
      />

      <Column header="Acciones" bodyClass="text-center">
        <template #body="slotProps">
          <div class="flex gap-2 justify-content-center">
            <Button
                icon="pi pi-pencil"
                text
                rounded
                @click="goEdit(slotProps.data.id)"
                v-tooltip.top="'Editar unidad'"
            />
            <Button
                icon="pi pi-trash"
                text
                rounded
                severity="danger"
                @click="onDelete(slotProps.data.id)"
                v-tooltip.top="'Eliminar unidad'"
            />
          </div>
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'

import { getProperties, deleteProperty } from '@/api/propertiesApi'

const router = useRouter()
const toast = useToast()

const rawProperties = ref([])
const loading = ref(false)

const currencyMap = {
  PEN: 'S/',
  USD: '$'
}

const propertyTypeMap = {
  apartment: 'Departamento',
  house: 'Casa',
  duplex: 'Dúplex',
  loft: 'Loft',
  office: 'Oficina'
}

// baseURL del backend (la misma que usas en Axios)
const apiBaseUrl = import.meta.env.VITE_API_URL || ''

// Origen del backend (ej: http://localhost:5137)
let backendOrigin = window.location.origin

if (apiBaseUrl.startsWith('http://') || apiBaseUrl.startsWith('https://')) {
  // Ej: http://localhost:5137/api -> http://localhost:5137
  backendOrigin = apiBaseUrl.replace(/\/api\/?$/, '')
}

// Normaliza la URL de la imagen que viene del backend
function buildImageUrl(raw) {
  if (!raw) return null

  // Ya es absoluta
  if (raw.startsWith('http://') || raw.startsWith('https://')) {
    return raw
  }

  // 'uploads/archivo.jpg'
  if (!raw.startsWith('/')) {
    return `${backendOrigin}/${raw}`
  }

  // '/uploads/archivo.jpg'
  return `${backendOrigin}${raw}`
}

// Mapeo backend -> columnas usadas en la tabla
const properties = computed(() =>
    rawProperties.value.map((p) => ({
      ...p,
      projectName: p.projectName ?? p.name ?? '',
      area: p.area ?? (p.areaM2 != null ? Number(p.areaM2) : null),
      propertyTypeLabel: propertyTypeMap[p.propertyType] || 'Departamento',
      imageUrl: buildImageUrl(p.imageUrl)
    }))
)

function priceTemplate(row) {
  const prefix = currencyMap[row.currency] || ''
  if (row.price == null) return '-'

  return `${prefix} ${Number(row.price).toLocaleString('es-PE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`
}

function goNew() {
  router.push({ name: 'property-new' })
}

function goEdit(id) {
  router.push({ name: 'property-edit', params: { id } })
}

async function onDelete(id) {
  const ok = window.confirm(
      '¿Seguro que deseas eliminar esta unidad? Esta acción no se puede deshacer.'
  )
  if (!ok) return

  try {
    await deleteProperty(id)

    // Quitar la unidad eliminada del array en memoria
    rawProperties.value = rawProperties.value.filter((p) => p.id !== id)

    toast.add({
      severity: 'success',
      summary: 'Unidad eliminada',
      detail: 'La unidad inmobiliaria se eliminó correctamente.',
      life: 3000
    })
  } catch (error) {
    console.error('Error al eliminar propiedad', error)
    toast.add({
      severity: 'error',
      summary: 'Error al eliminar',
      detail:
          error?.response?.data?.title ||
          error?.response?.data?.message ||
          'No se pudo eliminar la unidad.',
      life: 4000
    })
  }
}

onMounted(async () => {
  loading.value = true
  try {
    const response = await getProperties()
    rawProperties.value = response.data
  } catch (error) {
    console.error('Error al obtener propiedades', error)
    toast.add({
      severity: 'warn',
      summary: 'Usando datos de ejemplo',
      detail: 'No se pudo obtener la lista de unidades desde el servidor.',
      life: 3000
    })

    rawProperties.value = [
      {
        id: 1,
        code: 'D101',
        name: 'Residencial Los Álamos',
        propertyType: 'apartment',
        areaM2: 75,
        bedrooms: 3,
        bathrooms: 2,
        currency: 'PEN',
        price: 320000,
        imageUrl: 'https://via.placeholder.com/80x80?text=D101'
      },
      {
        id: 2,
        code: 'C202',
        name: 'Condominio Los Olivos',
        propertyType: 'house',
        areaM2: 120,
        bedrooms: 4,
        bathrooms: 3,
        currency: 'PEN',
        price: 480000,
        imageUrl: 'https://via.placeholder.com/80x80?text=C202'
      }
    ]
  } finally {
    loading.value = false
  }
})
</script>
