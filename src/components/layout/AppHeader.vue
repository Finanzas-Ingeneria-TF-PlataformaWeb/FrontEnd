<template>
  <header class="app-header">
    <div class="header-inner">
      <div class="header-left">
        <div class="header-title">
          <span class="header-app-name">Simulador MiVivienda</span>

          <div class="header-section-row">
            <span class="header-section-pill">
              <span class="header-section-dot"></span>
              <span class="header-section-text">
                {{ currentSectionLabel }}
              </span>
            </span>
          </div>
        </div>
      </div>

      <div class="header-right">
        <div class="header-user">
          <div class="user-avatar">
            <span>{{ userInitials }}</span>
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
  position: sticky;
  top: 0;
  z-index: 30;
  height: 70px;
  width: 100%;
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
  background:
      radial-gradient(circle at 0 0, rgba(74, 222, 128, 0.16), transparent 60%),
      rgba(249, 250, 251, 0.9);
  border-bottom: 1px solid rgba(209, 213, 219, 0.9);
  box-shadow:
      0 12px 30px rgba(15, 23, 42, 0.08),
      0 1px 0 rgba(255, 255, 255, 0.8) inset;
}

.app-header::before {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(
      90deg,
      rgba(34, 197, 94, 0.11),
      transparent 35%,
      transparent 70%,
      rgba(59, 130, 246, 0.08)
  );
  pointer-events: none;
  opacity: 0.8;
}

/* 🔹 Ahora ocupa todo el ancho, como antes */
.header-inner {
  width: 100%;
  height: 100%;
  padding: 0 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  z-index: 1;
}

/* izquierda */

.header-left {
  display: flex;
  align-items: center;
}

.header-title {
  display: flex;
  flex-direction: column;
  gap: 0.13rem;
}

.header-app-name {
  font-size: 1.02rem;
  font-weight: 650;
  color: #064e3b;
  letter-spacing: 0.02em;
}

.header-section-row {
  display: flex;
  align-items: center;
  margin-top: 0.05rem;
}

.header-section-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.2rem 0.55rem 0.2rem 0.3rem;
  border-radius: 999px;
  background: rgba(15, 23, 42, 0.03);
  border: 1px solid rgba(148, 163, 184, 0.6);
  box-shadow:
      0 0 0 1px rgba(255, 255, 255, 0.9),
      0 6px 12px rgba(148, 163, 184, 0.35);
}

.header-section-dot {
  width: 0.55rem;
  height: 0.55rem;
  border-radius: 999px;
  background: radial-gradient(circle, #22c55e, #16a34a);
  box-shadow: 0 0 0 4px rgba(34, 197, 94, 0.35);
}

.header-section-text {
  font-size: 0.8rem;
  color: #4b5563;
  font-weight: 500;
  white-space: nowrap;
}

/* derecha */

.header-right {
  display: flex;
  align-items: center;
  gap: 1.1rem;
}

.header-user {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  padding: 0.3rem 0.55rem 0.3rem 0.3rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.9);
  box-shadow:
      0 10px 22px rgba(148, 163, 184, 0.55),
      0 0 0 1px rgba(229, 231, 235, 0.9);
}

.user-avatar {
  width: 2.1rem;
  height: 2.1rem;
  border-radius: 999px;
  background: conic-gradient(from 150deg, #22c55e, #4ade80, #22c55e);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ecfdf3;
  font-weight: 700;
  font-size: 0.9rem;
  box-shadow:
      0 0 0 3px rgba(209, 250, 229, 0.95),
      0 8px 18px rgba(22, 163, 74, 0.65);
  animation: avatar-float 4s ease-in-out infinite;
}

@keyframes avatar-float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-2px);
  }
}

.user-info {
  display: flex;
  flex-direction: column;
  line-height: 1.15;
}

.user-name {
  font-size: 0.88rem;
  font-weight: 600;
  color: #111827;
}

.user-email {
  font-size: 0.74rem;
  color: #6b7280;
}

/* botón logout PrimeVue custom */

.logout-button {
  border-radius: 999px !important;
  border-color: rgba(34, 197, 94, 0.7) !important;
  color: #065f46 !important;
  background: rgba(236, 253, 245, 0.8) !important;
  box-shadow:
      0 8px 16px rgba(22, 163, 74, 0.25),
      0 0 0 1px rgba(209, 250, 229, 0.9);
  font-weight: 600 !important;
  padding-inline: 0.9rem !important;
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  transition:
      background-color 0.18s ease,
      color 0.18s ease,
      transform 0.1s ease,
      box-shadow 0.18s ease;
}

.logout-button .pi {
  font-size: 0.85rem;
}

.logout-button:hover {
  background: linear-gradient(135deg, #22c55e, #16a34a) !important;
  color: #f9fafb !important;
  transform: translateY(-1px);
  box-shadow:
      0 12px 24px rgba(22, 163, 74, 0.55),
      0 0 0 1px rgba(209, 250, 229, 1);
}

.logout-button:active {
  transform: translateY(0);
  box-shadow:
      0 6px 14px rgba(22, 163, 74, 0.55),
      0 0 0 1px rgba(22, 163, 74, 0.9);
}

/* responsivo */

@media (max-width: 900px) {
  .header-inner {
    padding: 0 1rem;
  }

  .user-email {
    display: none;
  }
}

@media (max-width: 640px) {
  .header-inner {
    padding: 0 0.75rem;
  }

  .header-app-name {
    font-size: 0.95rem;
  }

  .header-section-text {
    max-width: 140px;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>
<style scoped>
.app-header {
  position: sticky;
  top: 0;
  z-index: 30;
  height: 70px;
  width: 100%;
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
  background:
      radial-gradient(circle at 0 0, rgba(74, 222, 128, 0.16), transparent 60%),
      rgba(249, 250, 251, 0.9);
  border-bottom: 1px solid rgba(209, 213, 219, 0.9);
  box-shadow:
      0 12px 30px rgba(15, 23, 42, 0.08),
      0 1px 0 rgba(255, 255, 255, 0.8) inset;
}

.app-header::before {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(
      90deg,
      rgba(34, 197, 94, 0.11),
      transparent 35%,
      transparent 70%,
      rgba(59, 130, 246, 0.08)
  );
  pointer-events: none;
  opacity: 0.8;
}

/* 🔹 Ahora ocupa todo el ancho, como antes */
.header-inner {
  width: 100%;
  height: 100%;
  padding: 0 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  z-index: 1;
}

/* izquierda */

.header-left {
  display: flex;
  align-items: center;
}

.header-title {
  display: flex;
  flex-direction: column;
  gap: 0.13rem;
}

.header-app-name {
  font-size: 1.02rem;
  font-weight: 650;
  color: #064e3b;
  letter-spacing: 0.02em;
}

.header-section-row {
  display: flex;
  align-items: center;
  margin-top: 0.05rem;
}

.header-section-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.2rem 0.55rem 0.2rem 0.3rem;
  border-radius: 999px;
  background: rgba(15, 23, 42, 0.03);
  border: 1px solid rgba(148, 163, 184, 0.6);
  box-shadow:
      0 0 0 1px rgba(255, 255, 255, 0.9),
      0 6px 12px rgba(148, 163, 184, 0.35);
}

.header-section-dot {
  width: 0.55rem;
  height: 0.55rem;
  border-radius: 999px;
  background: radial-gradient(circle, #22c55e, #16a34a);
  box-shadow: 0 0 0 4px rgba(34, 197, 94, 0.35);
}

.header-section-text {
  font-size: 0.8rem;
  color: #4b5563;
  font-weight: 500;
  white-space: nowrap;
}

/* derecha */

.header-right {
  display: flex;
  align-items: center;
  gap: 1.1rem;
}

.header-user {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  padding: 0.3rem 0.55rem 0.3rem 0.3rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.9);
  box-shadow:
      0 10px 22px rgba(148, 163, 184, 0.55),
      0 0 0 1px rgba(229, 231, 235, 0.9);
}

.user-avatar {
  width: 2.1rem;
  height: 2.1rem;
  border-radius: 999px;
  background: conic-gradient(from 150deg, #22c55e, #4ade80, #22c55e);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ecfdf3;
  font-weight: 700;
  font-size: 0.9rem;
  box-shadow:
      0 0 0 3px rgba(209, 250, 229, 0.95),
      0 8px 18px rgba(22, 163, 74, 0.65);
  animation: avatar-float 4s ease-in-out infinite;
}

@keyframes avatar-float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-2px);
  }
}

.user-info {
  display: flex;
  flex-direction: column;
  line-height: 1.15;
}

.user-name {
  font-size: 0.88rem;
  font-weight: 600;
  color: #111827;
}

.user-email {
  font-size: 0.74rem;
  color: #6b7280;
}

/* botón logout PrimeVue custom */

.logout-button {
  border-radius: 999px !important;
  border-color: rgba(34, 197, 94, 0.7) !important;
  color: #065f46 !important;
  background: rgba(236, 253, 245, 0.8) !important;
  box-shadow:
      0 8px 16px rgba(22, 163, 74, 0.25),
      0 0 0 1px rgba(209, 250, 229, 0.9);
  font-weight: 600 !important;
  padding-inline: 0.9rem !important;
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  transition:
      background-color 0.18s ease,
      color 0.18s ease,
      transform 0.1s ease,
      box-shadow 0.18s ease;
}

.logout-button .pi {
  font-size: 0.85rem;
}

.logout-button:hover {
  background: linear-gradient(135deg, #22c55e, #16a34a) !important;
  color: #f9fafb !important;
  transform: translateY(-1px);
  box-shadow:
      0 12px 24px rgba(22, 163, 74, 0.55),
      0 0 0 1px rgba(209, 250, 229, 1);
}

.logout-button:active {
  transform: translateY(0);
  box-shadow:
      0 6px 14px rgba(22, 163, 74, 0.55),
      0 0 0 1px rgba(22, 163, 74, 0.9);
}

/* responsivo */

@media (max-width: 900px) {
  .header-inner {
    padding: 0 1rem;
  }

  .user-email {
    display: none;
  }
}

@media (max-width: 640px) {
  .header-inner {
    padding: 0 0.75rem;
  }

  .header-app-name {
    font-size: 0.95rem;
  }

  .header-section-text {
    max-width: 140px;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>
