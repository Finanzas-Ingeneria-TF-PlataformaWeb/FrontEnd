<template>
  <div class="dashboard-page">
    <!-- Header -->
    <div
        class="flex justify-content-between align-items-center mb-3 dashboard-header"
    >
      <div>
        <h2 class="mb-1 dashboard-title">Dashboard</h2>
        <p class="text-sm text-600 dashboard-subtitle">
          Vista general del simulador MiVivienda para la inmobiliaria.
        </p>
      </div>

      <div class="dashboard-header-right">
        <div class="dashboard-pill">
          <span class="pill-dot"></span>
          <span class="pill-text">
            {{ customersCount }} clientes · {{ propertiesCount }} unidades
          </span>
        </div>
      </div>
    </div>

    <!-- Estado cargando -->
    <div v-if="loading" class="dashboard-loading">
      <div class="loading-card">
        <div class="spinner"></div>
        <div class="loading-text-main">Cargando información del dashboard…</div>
        <div class="loading-text-sub">
          Obteniendo clientes, unidades e inventario desde el backend.
        </div>
      </div>
    </div>

    <!-- Contenido principal -->
    <div v-else class="dashboard-content">
      <!-- Tarjetas de resumen -->
      <div class="grid mb-3 kpi-grid">
        <div class="col-12 md:col-4">
          <Card class="card-stat card-stat-customers">
            <template #content>
              <div class="stat-header">
                <div>
                  <div class="stat-title">Clientes registrados</div>
                  <div class="stat-value">
                    {{ customersCount }}
                  </div>
                  <div class="stat-sub">
                    Clientes con información socioeconómica
                  </div>
                </div>
                <div class="stat-icon">
                  <i class="pi pi-users" />
                </div>
              </div>
            </template>
          </Card>
        </div>

        <div class="col-12 md:col-4">
          <Card class="card-stat card-stat-properties">
            <template #content>
              <div class="stat-header">
                <div>
                  <div class="stat-title">Unidades registradas</div>
                  <div class="stat-value">
                    {{ propertiesCount }}
                  </div>
                  <div class="stat-sub">
                    Departamentos, casas u oficinas disponibles
                  </div>
                </div>
                <div class="stat-icon">
                  <i class="pi pi-home" />
                </div>
              </div>
            </template>
          </Card>
        </div>

        <div class="col-12 md:col-4">
          <Card class="card-stat card-stat-inventory">
            <template #content>
              <div class="stat-header">
                <div>
                  <div class="stat-title">Inventario inmobiliario</div>
                  <div class="stat-inventory mt-1">
                    <div v-if="inventoryByCurrency.PEN">
                      <span class="stat-label">En soles:</span>
                      <span class="stat-amount">
                        {{ formatCurrency(inventoryByCurrency.PEN, 'PEN') }}
                      </span>
                    </div>
                    <div v-if="inventoryByCurrency.USD" class="mt-1">
                      <span class="stat-label">En dólares:</span>
                      <span class="stat-amount">
                        {{ formatCurrency(inventoryByCurrency.USD, 'USD') }}
                      </span>
                    </div>
                    <div
                        v-if="
                        !inventoryByCurrency.PEN && !inventoryByCurrency.USD
                      "
                    >
                      <span class="stat-sub">
                        Registra unidades para ver el valor del inventario.
                      </span>
                    </div>
                  </div>
                </div>
                <div class="stat-icon stat-icon-inventory">
                  <i class="pi pi-wallet" />
                </div>
              </div>
            </template>
          </Card>
        </div>
      </div>

      <!-- Gráficos -->
      <div class="grid mb-4">
        <div class="col-12 lg:col-6">
          <Card class="chart-card">
            <template #title>Inventario por moneda</template>
            <template #content>
              <p class="text-sm text-600 mb-3">
                Distribución del valor de las unidades entre soles y dólares.
              </p>
              <div v-if="inventoryChartData" class="chart-wrapper">
                <Chart
                    type="doughnut"
                    :data="inventoryChartData"
                    :options="inventoryChartOptions"
                />
              </div>
              <p v-else class="empty-state">
                <i class="pi pi-info-circle empty-state-icon" />
                <span>
                  Aún no hay datos suficientes para mostrar este gráfico.
                </span>
              </p>
            </template>
          </Card>
        </div>

        <div class="col-12 lg:col-6">
          <Card class="chart-card">
            <template #title>Unidades por tipo</template>
            <template #content>
              <p class="text-sm text-600 mb-3">
                Cantidad de unidades según tipo de inmueble.
              </p>
              <div v-if="unitsByTypeChartData" class="chart-wrapper">
                <Chart
                    type="bar"
                    :data="unitsByTypeChartData"
                    :options="unitsByTypeChartOptions"
                />
              </div>
              <p v-else class="empty-state">
                <i class="pi pi-info-circle empty-state-icon" />
                <span>
                  Registra unidades para ver la distribución por tipo.
                </span>
              </p>
            </template>
          </Card>
        </div>
      </div>

      <!-- Tablas inferiores -->
      <div class="grid">
        <div class="col-12 lg:col-6">
          <Card class="table-card">
            <template #title>Últimos clientes</template>
            <template #content>
              <p class="text-sm text-600 mb-3">
                Resumen rápido de los últimos clientes registrados.
              </p>

              <DataTable
                  class="dashboard-table"
                  :value="recentCustomers"
                  size="small"
                  :loading="loading"
                  responsive-layout="scroll"
                  :rows="5"
                  empty-message="Aún no hay clientes registrados."
              >
                <Column header="Cliente">
                  <template #body="slotProps">
                    <div class="table-customer">
                      <div class="table-avatar">
                        <span>
                          {{ getInitials(slotProps.data.fullName) }}
                        </span>
                      </div>
                      <div class="table-customer-info">
                        <span class="customer-name">
                          {{ slotProps.data.fullName || 'Sin nombre' }}
                        </span>
                        <span
                            v-if="slotProps.data.documentNumber"
                            class="customer-doc"
                        >
                          {{ slotProps.data.documentNumber }}
                        </span>
                      </div>
                    </div>
                  </template>
                </Column>

                <Column header="Ingreso mensual">
                  <template #body="slotProps">
                    {{
                      slotProps.data.monthlyIncome != null
                          ? formatCurrency(slotProps.data.monthlyIncome, 'PEN')
                          : '-'
                    }}
                  </template>
                </Column>

                <Column header="Estado civil">
                  <template #body="slotProps">
                    {{ maritalStatusMap[slotProps.data.maritalStatus] || '-' }}
                  </template>
                </Column>
              </DataTable>
            </template>
          </Card>
        </div>

        <div class="col-12 lg:col-6">
          <Card class="table-card">
            <template #title>Unidades destacadas</template>
            <template #content>
              <p class="text-sm text-600 mb-3">
                Unidades registradas recientemente en el sistema.
              </p>

              <DataTable
                  class="dashboard-table"
                  :value="highlightedProperties"
                  size="small"
                  :loading="loading"
                  responsive-layout="scroll"
                  :rows="5"
                  empty-message="Aún no hay unidades registradas."
              >
                <Column header="Unidad">
                  <template #body="slotProps">
                    <div class="flex align-items-center gap-2">
                      <img
                          v-if="slotProps.data.imageUrl"
                          :src="slotProps.data.imageUrl"
                          alt="Unidad"
                          class="w-2rem h-2rem border-round unit-image"
                      />
                      <i v-else class="pi pi-building text-300" />
                      <div class="flex flex-column">
                        <span class="font-medium">
                          {{ slotProps.data.code }}
                        </span>
                        <span class="text-xs text-600">
                          {{ slotProps.data.projectName }}
                        </span>
                      </div>
                    </div>
                  </template>
                </Column>
                <Column field="propertyTypeLabel" header="Tipo" />
                <Column header="Área">
                  <template #body="slotProps">
                    {{ slotProps.data.area }} m²
                  </template>
                </Column>
                <Column header="Precio">
                  <template #body="slotProps">
                    {{
                      slotProps.data.price != null
                          ? formatCurrency(
                              slotProps.data.price,
                              slotProps.data.currency
                          )
                          : '-'
                    }}
                  </template>
                </Column>
              </DataTable>
            </template>
          </Card>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useToast } from 'primevue/usetoast'
import Chart from 'primevue/chart'

import { getCustomers } from '@/api/customersApi'
import { getProperties } from '@/api/propertiesApi'

// ================== CONFIG BACKEND / IMÁGENES ==================

// Igual que en PropertiesListView
const apiBaseUrl = import.meta.env.VITE_API_URL || ''

// Por defecto, el origen es el del navegador (útil si usas proxy /api)
let backendOrigin = window.location.origin

// Si VITE_API_URL es absoluta (http://localhost:5137/api, etc.)
if (apiBaseUrl.startsWith('http://') || apiBaseUrl.startsWith('https://')) {
  backendOrigin = apiBaseUrl.replace(/\/api\/?$/, '')
}

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

// ================== ESTADO ==================
const toast = useToast()

const customers = ref([])
const properties = ref([])
const loading = ref(false)

const customersCount = computed(() => customers.value.length)
const propertiesCount = computed(() => properties.value.length)

const maritalStatusMap = {
  single: 'Soltero(a)',
  married: 'Casado(a)',
  cohabitant: 'Conviviente',
  divorced: 'Divorciado(a)',
  widowed: 'Viudo(a)'
}

const propertyTypeMap = {
  apartment: 'Departamento',
  house: 'Casa',
  duplex: 'Dúplex',
  loft: 'Loft',
  office: 'Oficina'
}

// ================== CÁLCULOS ==================

const inventoryByCurrency = computed(() => {
  const result = { PEN: 0, USD: 0 }

  properties.value.forEach((p) => {
    if (!p.price || !p.currency) return
    if (p.currency === 'USD') {
      result.USD += Number(p.price)
    } else {
      result.PEN += Number(p.price)
    }
  })

  return result
})

// últimos 5 clientes
const recentCustomers = computed(() => [...customers.value].slice(0, 5))

// unidades destacadas con imagen normalizada
const highlightedProperties = computed(() =>
    [...properties.value]
        .map((p) => ({
          ...p,
          propertyTypeLabel: propertyTypeMap[p.propertyType] || '',
          area: p.area ?? (p.areaM2 != null ? Number(p.areaM2) : null),
          imageUrl: buildImageUrl(p.imageUrl)
        }))
        .slice(0, 5)
)

/* ====== GRÁFICO INVENTARIO POR MONEDA ====== */

const inventoryChartData = computed(() => {
  const pen = inventoryByCurrency.value.PEN || 0
  const usd = inventoryByCurrency.value.USD || 0

  if (!pen && !usd) return null

  return {
    labels: ['Soles (PEN)', 'Dólares (USD)'],
    datasets: [
      {
        data: [pen, usd],
        backgroundColor: ['#16a34a', '#22c55e'],
        hoverBackgroundColor: ['#15803d', '#16a34a']
      }
    ]
  }
})

const inventoryChartOptions = {
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        color: '#4b5563',
        usePointStyle: true
      }
    }
  },
  responsive: true,
  maintainAspectRatio: false
}

/* ====== GRÁFICO UNIDADES POR TIPO ====== */

const unitsByType = computed(() => {
  const counts = {}
  properties.value.forEach((p) => {
    const key = p.propertyType || 'other'
    counts[key] = (counts[key] || 0) + 1
  })
  return counts
})

const unitsByTypeChartData = computed(() => {
  const entries = Object.entries(unitsByType.value)
  if (!entries.length) return null

  const labels = entries.map(([type]) => propertyTypeMap[type] || 'Otro')
  const data = entries.map(([, count]) => count)

  return {
    labels,
    datasets: [
      {
        label: 'Unidades',
        data,
        backgroundColor: ['#16a34a', '#22c55e', '#059669', '#10b981', '#bbf7d0']
      }
    ]
  }
})

const unitsByTypeChartOptions = {
  plugins: {
    legend: {
      display: false
    }
  },
  scales: {
    x: {
      ticks: {
        color: '#4b5563'
      },
      grid: {
        display: false
      }
    },
    y: {
      ticks: {
        color: '#6b7280',
        precision: 0
      },
      grid: {
        color: '#e5e7eb'
      }
    }
  },
  responsive: true,
  maintainAspectRatio: false
}

/* ========================= UTIL ========================= */

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

function getInitials(name) {
  if (!name) return '?'
  const parts = name
      .trim()
      .split(' ')
      .filter(Boolean)
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase()
  }
  return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase()
}

async function loadData() {
  loading.value = true
  try {
    const [customersResponse, propertiesResponse] = await Promise.all([
      getCustomers(),
      getProperties()
    ])

    customers.value = customersResponse.data
    properties.value = propertiesResponse.data
  } catch (error) {
    // Demo fallback
    customers.value = [
      {
        id: 1,
        fullName: 'Juan Pérez',
        documentNumber: '12345678',
        maritalStatus: 'single',
        monthlyIncome: 4500
      }
    ]

    properties.value = [
      {
        id: 1,
        code: 'D101',
        projectName: 'Residencial Los Álamos',
        propertyType: 'apartment',
        area: 75,
        currency: 'PEN',
        price: 320000,
        imageUrl: 'https://via.placeholder.com/80x80?text=D101'
      }
    ]

    toast.add({
      severity: 'warn',
      summary: 'Datos de ejemplo',
      detail:
          'Aún no hay backend conectado, se muestran datos demo en el dashboard.',
      life: 3000
    })
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.dashboard-page {
  animation: fadeIn 0.25s ease-out;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* Header */
.dashboard-header {
  gap: 1rem;
}

.dashboard-title {
  font-size: 1.35rem;
  font-weight: 700;
  color: #111827;
  letter-spacing: 0.02em;
}

.dashboard-subtitle {
  color: #6b7280;
  margin: 0;
  font-size: 0.85rem;
}

.dashboard-header-right {
  display: flex;
  align-items: center;
}

.dashboard-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.3rem 0.75rem;
  border-radius: 999px;
  background: #ecfdf5;
  border: 1px solid #bbf7d0;
  font-size: 0.78rem;
  font-weight: 500;
  color: #047857;
}

.pill-dot {
  width: 6px;
  height: 6px;
  border-radius: 999px;
  background: #22c55e;
}

.pill-text {
  white-space: nowrap;
}

/* Loading full state */
.dashboard-loading {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 260px;
}

.loading-card {
  padding: 1.25rem 1.5rem;
  border-radius: 1rem;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  max-width: 460px;
  text-align: center;
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.06);
}

.spinner {
  width: 24px;
  height: 24px;
  border-radius: 999px;
  border: 3px solid #d1d5db;
  border-top-color: #22c55e;
  margin: 0 auto 0.75rem;
  animation: spin 0.6s linear infinite;
}

.loading-text-main {
  font-size: 0.9rem;
  font-weight: 600;
  color: #111827;
}

.loading-text-sub {
  margin-top: 0.25rem;
  font-size: 0.8rem;
  color: #6b7280;
}

/* === KPIs === */

.kpi-grid {
  row-gap: 1rem;
}

.card-stat {
  height: 100%;
  border: none;
  border-radius: 1rem;
  position: relative;
  overflow: hidden;
  box-shadow: 0 12px 28px rgba(15, 23, 42, 0.08);
  background: radial-gradient(circle at top left, #ecfdf5, #ffffff);
  transform-origin: center;
  transition:
      transform 0.16s ease-out,
      box-shadow 0.16s ease-out;
}

.card-stat::before {
  content: '';
  position: absolute;
  inset: -40%;
  background:
      radial-gradient(circle at 0 0, rgba(34, 197, 94, 0.18), transparent 60%),
      radial-gradient(circle at 100% 100%, rgba(59, 130, 246, 0.18), transparent 65%);
  opacity: 0.9;
  pointer-events: none;
}

.card-stat :deep(.p-card-body) {
  padding: 1.1rem 1.25rem 1rem;
}

.card-stat-customers {
  border-top: 4px solid #22c55e;
}

.card-stat-properties {
  border-top: 4px solid #0ea5e9;
}

.card-stat-inventory {
  border-top: 4px solid #f59e0b;
}

.card-stat:hover {
  transform: translateY(-3px);
  box-shadow: 0 18px 40px rgba(15, 23, 42, 0.14);
}

.stat-header {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 1;
}

.stat-title {
  font-size: 0.82rem;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: 0.2rem;
}

.stat-value {
  font-size: 2.25rem;
  font-weight: 700;
  color: #065f46;
}

.stat-sub {
  margin-top: 0.35rem;
  font-size: 0.85rem;
  color: #6b7280;
}

.stat-inventory {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.stat-label {
  font-size: 0.8rem;
  color: #6b7280;
  margin-right: 0.25rem;
}

.stat-amount {
  font-weight: 600;
  font-size: 0.96rem;
  color: #065f46;
}

.card-stat-inventory .stat-amount {
  color: #92400e;
}

.stat-icon {
  width: 3.1rem;
  height: 3.1rem;
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(16, 185, 129, 0.09);
  color: #047857;
  font-size: 1.3rem;
  box-shadow:
      0 0 0 1px rgba(209, 250, 229, 0.9),
      0 10px 24px rgba(16, 185, 129, 0.35);
}

.card-stat-properties .stat-icon {
  background: rgba(37, 99, 235, 0.08);
  color: #1d4ed8;
  box-shadow:
      0 0 0 1px rgba(191, 219, 254, 0.9),
      0 10px 24px rgba(59, 130, 246, 0.35);
}

.stat-icon-inventory {
  background: rgba(245, 158, 11, 0.09);
  color: #b45309;
  box-shadow:
      0 0 0 1px rgba(254, 243, 199, 0.9),
      0 10px 24px rgba(245, 158, 11, 0.35);
}

/* === Cards de gráficos / tablas === */

.chart-card,
.table-card {
  height: 100%;
  border-radius: 1rem;
  border: none;
  position: relative;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.96);
  box-shadow: 0 10px 28px rgba(15, 23, 42, 0.08);
  animation: fadeInUp 0.45s ease-out;
}

.chart-card::before,
.table-card::before {
  content: '';
  position: absolute;
  inset: -30%;
  background: radial-gradient(circle at 0 0, rgba(209, 250, 229, 0.4), transparent 60%);
  opacity: 0.5;
  pointer-events: none;
}

.chart-card :deep(.p-card-body),
.table-card :deep(.p-card-body) {
  padding: 1.1rem 1.25rem 1.25rem;
}

.chart-card :deep(.p-card-title),
.table-card :deep(.p-card-title) {
  font-size: 0.95rem;
  font-weight: 600;
  color: #111827;
}

.chart-wrapper {
  width: 100%;
  height: 260px;
}

/* estados vacíos de gráficos */

.empty-state {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.82rem;
  color: #6b7280;
  padding: 0.4rem 0.5rem;
  background: rgba(249, 250, 251, 0.9);
  border-radius: 0.75rem;
  border: 1px dashed rgba(209, 213, 219, 0.9);
}

.empty-state-icon {
  font-size: 0.95rem;
  color: #9ca3af;
}

/* tablas */

.unit-image {
  object-fit: cover;
}

.dashboard-table :deep(.p-datatable-thead > tr > th) {
  background: #f9fafb;
  color: #4b5563;
  font-size: 0.78rem;
  font-weight: 600;
  border: 0;
  border-bottom: 1px solid #e5e7eb;
}

.dashboard-table :deep(.p-datatable-tbody > tr > td) {
  font-size: 0.8rem;
  color: #374151;
  border: 0;
  border-top: 1px solid #f3f4f6;
}

.dashboard-table :deep(.p-datatable-tbody > tr:hover) {
  background: #f9fafb;
}

/* Cliente en tabla */

.table-customer {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.table-avatar {
  width: 2rem;
  height: 2rem;
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #22c55e, #0ea5e9);
  color: #f9fafb;
  font-size: 0.75rem;
  font-weight: 600;
}

.table-customer-info {
  display: flex;
  flex-direction: column;
}

.customer-name {
  font-size: 0.8rem;
  font-weight: 600;
  color: #111827;
}

.customer-doc {
  font-size: 0.72rem;
  color: #6b7280;
}

/* Animaciones */

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 768px) {
  .dashboard-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .dashboard-header-right {
    width: 100%;
    justify-content: flex-start;
  }

  .dashboard-pill {
    width: fit-content;
  }
}
</style>
