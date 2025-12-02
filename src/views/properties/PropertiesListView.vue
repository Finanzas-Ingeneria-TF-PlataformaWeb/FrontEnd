<template>
  <div class="properties-page">
    <!-- Header -->
    <div class="properties-header">
      <div>
        <h2 class="properties-title">Unidades inmobiliarias</h2>
        <p class="properties-subtitle">
          Gestiona las unidades disponibles para el simulador MiVivienda.
        </p>
      </div>

      <div class="header-actions">
        <div v-if="!loading" class="properties-pill">
          <span class="pill-dot"></span>
          {{ properties.length }} unidades registradas
        </div>

        <Button
            label="Nueva unidad"
            icon="pi pi-plus"
            class="p-button-sm"
            @click="goNew"
        />
      </div>
    </div>

    <!-- Estado: cargando -->
    <div v-if="loading" class="state-card">
      <span class="state-title">Cargando unidades...</span>
      <p class="state-text">
        Estamos obteniendo la lista de unidades desde el backend.
      </p>
    </div>

    <!-- Estado: sin datos -->
    <div v-else-if="!hasProperties" class="state-card state-empty">
      <span class="state-title">Aún no hay unidades registradas</span>
      <p class="state-text">
        Registra una nueva unidad con el botón
        <strong>“Nueva unidad”</strong> para que pueda ser utilizada en las
        simulaciones de crédito.
      </p>
    </div>

    <!-- Tabla -->
    <div v-else class="table-card">
      <DataTable
          :value="properties"
          paginator
          :rows="10"
          :rows-per-page-options="[10, 20, 50]"
          responsive-layout="scroll"
          row-hover
      >
        <!-- Columna Unidad (imagen + info) -->
        <Column header="Unidad">
          <template #body="slotProps">
            <div class="cell-with-image">
              <div class="image-wrapper">
                <img
                    v-if="slotProps.data.imageUrl"
                    :src="slotProps.data.imageUrl"
                    alt="Unidad"
                    class="unit-image"
                />
                <div v-else class="image-fallback">
                  <i class="pi pi-building"></i>
                </div>
              </div>

              <div class="unit-text">
                <span class="unit-code">
                  {{ slotProps.data.code || 'Sin código' }}
                </span>
                <span class="unit-project">
                  {{ slotProps.data.projectName || 'Sin proyecto' }}
                </span>
                <span class="unit-type-chip">
                  {{ slotProps.data.propertyTypeLabel }}
                </span>
              </div>
            </div>
          </template>
        </Column>

        <Column header="Área (m²)">
          <template #body="slotProps">
            <span>
              {{ slotProps.data.area != null ? slotProps.data.area : '-' }}
            </span>
          </template>
        </Column>

        <Column header="Dorm.">
          <template #body="slotProps">
            {{ slotProps.data.bedrooms ?? '-' }}
          </template>
        </Column>

        <Column header="Baños">
          <template #body="slotProps">
            {{ slotProps.data.bathrooms ?? '-' }}
          </template>
        </Column>

        <Column header="Precio">
          <template #body="slotProps">
            {{ priceTemplate(slotProps.data) }}
          </template>
        </Column>

        <Column header="Acciones" body-class="text-right">
          <template #body="slotProps">
            <div class="actions-cell">
              <Button
                  icon="pi pi-pencil"
                  class="p-button-rounded p-button-text p-button-sm"
                  v-tooltip.top="'Editar unidad'"
                  @click="goEdit(slotProps.data.id)"
              />
              <Button
                  icon="pi pi-trash"
                  class="p-button-rounded p-button-text p-button-sm p-button-danger"
                  v-tooltip.top="'Eliminar unidad'"
                  @click="onDelete(slotProps.data.id)"
              />
            </div>
          </template>
        </Column>
      </DataTable>
    </div>
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

// Acepta claves en inglés y en español, en minúsculas
const propertyTypeMap = {
  apartment: 'Departamento',
  departamento: 'Departamento',
  house: 'Casa',
  casa: 'Casa',
  duplex: 'Dúplex',
  'dúplex': 'Dúplex',
  loft: 'Loft',
  office: 'Oficina',
  oficina: 'Oficina'
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
    rawProperties.value.map((p) => {
      const typeKey = (p.propertyType || '').toString().toLowerCase()

      return {
        ...p,
        projectName: p.projectName ?? p.name ?? '',
        area: p.area ?? (p.areaM2 != null ? Number(p.areaM2) : null),
        propertyTypeLabel:
            propertyTypeMap[typeKey] || p.propertyType || 'Sin tipo',
        imageUrl: buildImageUrl(p.imageUrl)
      }
    })
)

const hasProperties = computed(() => properties.value.length > 0)

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

<style scoped>
.properties-page {
  animation: fadeIn 0.2s ease-out;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* Header */
.properties-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
}

.properties-title {
  font-size: 1.3rem;
  font-weight: 600;
  color: #064e3b;
  margin-bottom: 0.25rem;
}

.properties-subtitle {
  font-size: 0.85rem;
  color: #6b7280;
  margin: 0;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.properties-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
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

.state-empty {
  background: #fefce8;
  border-color: #facc15;
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

/* Card tabla */
.table-card {
  background: #ffffff;
  border-radius: 0.9rem;
  padding: 0.75rem 0.9rem 0.4rem;
  box-shadow: 0 8px 20px rgba(15, 23, 42, 0.06);
  border: 1px solid #e5e7eb;
}

/* Celdas personalizadas */
.cell-with-image {
  display: flex;
  align-items: center;
  gap: 0.7rem;
}

.image-wrapper {
  width: 3rem;
  height: 3rem;
  border-radius: 0.75rem;
  overflow: hidden;
  background: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
}

.unit-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-fallback {
  font-size: 1.1rem;
  color: #9ca3af;
}

.unit-text {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
}

.unit-code {
  font-size: 0.85rem;
  font-weight: 600;
  color: #111827;
}

.unit-project {
  font-size: 0.78rem;
  color: #6b7280;
}

.unit-type-chip {
  display: inline-flex;
  align-items: center;
  width: fit-content;
  margin-top: 0.1rem;
  padding: 0.1rem 0.5rem;
  border-radius: 999px;
  font-size: 0.7rem;
  font-weight: 500;
  background: #eff6ff;
  color: #1d4ed8;
}

/* Acciones */
.actions-cell {
  display: flex;
  justify-content: flex-end;
  gap: 0.25rem;
}

/* DataTable tweaks */
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

:deep(.p-datatable .p-datatable-tbody > tr.p-highlight) {
  background: #ecfdf5;
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
  .properties-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .header-actions {
    width: 100%;
    justify-content: space-between;
  }
}
</style>
