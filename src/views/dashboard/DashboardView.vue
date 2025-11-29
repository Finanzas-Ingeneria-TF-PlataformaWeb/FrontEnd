<template>
  <div class="dashboard-page">
    <div class="flex justify-content-between align-items-center mb-3">
      <div>
        <h2 class="mb-1">Dashboard</h2>
        <p class="text-sm text-600">
          Vista general del simulador MiVivienda para la inmobiliaria.
        </p>
      </div>
    </div>

    <!-- Tarjetas de resumen -->
    <div class="grid mb-3">
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
                  <div v-if="!inventoryByCurrency.PEN && !inventoryByCurrency.USD">
                    <span class="stat-sub">
                      Registra unidades para ver el valor del inventario.
                    </span>
                  </div>
                </div>
              </div>
              <div class="stat-icon">
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
            <p v-else class="text-sm text-500">
              Aún no hay datos suficientes para mostrar este gráfico.
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
            <p v-else class="text-sm text-500">
              Registra unidades para ver la distribución por tipo.
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
                :value="recentCustomers"
                size="small"
                :loading="loading"
                responsive-layout="scroll"
                :rows="5"
            >
              <Column field="fullName" header="Nombre" />
              <Column field="documentNumber" header="Documento" />
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
                :value="highlightedProperties"
                size="small"
                :loading="loading"
                responsive-layout="scroll"
                :rows="5"
            >
              <Column header="Unidad">
                <template #body="slotProps">
                  <div class="flex align-items-center gap-2">
                    <img
                        v-if="slotProps.data.imageUrl"
                        :src="slotProps.data.imageUrl"
                        alt="Unidad"
                        class="w-2rem h-2rem border-round"
                        style="object-fit: cover;"
                    />
                    <i
                        v-else
                        class="pi pi-building text-300"
                    />
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
}

/* Cards de KPIs */
.card-stat {
  height: 100%;
  border: none;
  border-radius: 0.9rem;
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.08);
  background: radial-gradient(circle at top left, #ecfdf5, #ffffff);
  animation: fadeInUp 0.45s ease-out;
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

.stat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.stat-title {
  font-size: 0.85rem;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  margin-bottom: 0.25rem;
}

.stat-value {
  font-size: 2.3rem;
  font-weight: 700;
  color: #065f46;
}

.stat-sub {
  margin-top: 0.4rem;
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
  font-size: 0.95rem;
}

.stat-icon {
  width: 3rem;
  height: 3rem;
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(16, 185, 129, 0.08);
  color: #047857;
  font-size: 1.3rem;
}

/* Cards de gráficos y tablas */
.chart-card,
.table-card {
  height: 100%;
  animation: fadeInUp 0.45s ease-out;
}

.chart-wrapper {
  width: 100%;
  height: 260px;
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
</style>
