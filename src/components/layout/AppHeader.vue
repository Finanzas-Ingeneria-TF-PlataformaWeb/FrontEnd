<template>
  <header class="app-header">
    <div class="header-left">
      <div class="header-title">
        <span class="header-app-name">Simulador MiVivienda</span>
        <span class="header-section">
          {{ currentSectionLabel }}
        </span>
      </div>
    </div>

    <div class="header-right">
      <div class="header-user">
        <div class="user-avatar">
          <span>
            {{ userInitials }}
          </span>
        </div>
        <div class="user-info">
          <span class="user-name">
            {{ userName }}
          </span>
          <span class="user-email">
            {{ userEmail }}
          </span>
        </div>
      </div>

      <Button
          label="Cerrar sesión"
          icon="pi pi-sign-out"
          class="p-button-sm p-button-outlined logout-button"
          @click="onLogout"
      />
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()

const sectionNames = {
  dashboard: 'Dashboard',
  customers: 'Clientes',
  'customer-new': 'Nuevo cliente',
  'customer-edit': 'Editar cliente',
  properties: 'Unidades inmobiliarias',
  'property-new': 'Nueva unidad inmobiliaria',
  'property-edit': 'Editar unidad inmobiliaria',
  'simulations-config': 'Simulación de crédito',
  'simulations-result': 'Plan de pagos',
  'settings-financial': 'Configuración financiera'
}

const currentSectionLabel = computed(() => {
  const name = route.name
  if (name && sectionNames[name]) {
    return sectionNames[name]
  }
  return 'Panel de asesor inmobiliario'
})

const userName = computed(() => {
  if (auth.user && auth.user.fullName) return auth.user.fullName
  if (auth.user && auth.user.name) return auth.user.name
  return 'Usuario Demo'
})

const userEmail = computed(() => {
  if (auth.user && auth.user.email) return auth.user.email
  return 'superadmin@demo.com'
})

const userInitials = computed(() => {
  const name = userName.value || ''
  const parts = name.split(' ').filter((p) => p.length > 0)
  if (parts.length === 0) return 'UD'
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase()
  return (
      parts[0].charAt(0).toUpperCase() +
      parts[parts.length - 1].charAt(0).toUpperCase()
  )
})

function onLogout() {
  if (auth.logout) {
    auth.logout()
  }
  router.push({ name: 'login' })
}
</script>

<style scoped>
.app-header {
  height: 64px;
  background: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1.5rem;
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.06);
}

.header-left {
  display: flex;
  align-items: center;
}

.header-title {
  display: flex;
  flex-direction: column;
}

.header-app-name {
  font-size: 1rem;
  font-weight: 600;
  color: #064e3b;
}

.header-section {
  font-size: 0.8rem;
  color: #6b7280;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.header-user {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.user-avatar {
  width: 2.1rem;
  height: 2.1rem;
  border-radius: 999px;
  background: linear-gradient(135deg, #16a34a, #22c55e);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ecfdf3;
  font-weight: 600;
  font-size: 0.9rem;
}

.user-info {
  display: flex;
  flex-direction: column;
  line-height: 1.1;
}

.user-name {
  font-size: 0.9rem;
  font-weight: 500;
  color: #111827;
}

.user-email {
  font-size: 0.75rem;
  color: #6b7280;
}

.logout-button {
  border-color: #16a34a;
  color: #065f46;
}

.logout-button:hover {
  background: #16a34a;
  color: #f9fafb;
}
</style>
