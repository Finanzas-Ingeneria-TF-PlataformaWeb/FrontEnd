<template>
  <aside class="sidebar hidden md:flex">
    <div class="sidebar-header">
      <div class="logo-circle">
        MV
      </div>
      <div class="sidebar-title">
        <div class="sidebar-app">MiVivienda</div>
        <div class="sidebar-sub">Inmobiliaria</div>
      </div>
    </div>

    <nav class="sidebar-nav">
      <RouterLink
          v-for="item in items"
          :key="item.to"
          :to="item.to"
          class="sidebar-link"
          :class="{ 'sidebar-link-active': isActive(item) }"
      >
        <i :class="['pi', item.icon, 'sidebar-link-icon']" />
        <span>{{ item.label }}</span>
      </RouterLink>
    </nav>
  </aside>
</template>

<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()

const items = [
  { label: 'Dashboard', to: '/', name: 'dashboard', icon: 'pi-chart-bar' },
  { label: 'Clientes', to: '/customers', name: 'customers', icon: 'pi-users' },
  { label: 'Unidades', to: '/properties', name: 'properties', icon: 'pi-building' },
  { label: 'Simulación', to: '/simulations/config', name: 'simulations-config', icon: 'pi-calculator' },
  { label: 'Historial', to: '/simulations', name: 'simulations-list', icon: 'pi-list' },
  { label: 'Config. financiera', to: '/settings/financial', name: 'settings-financial', icon: 'pi-cog' }
]

function isActive(item) {
  if (item.name && route.name) {
    return route.name === item.name
  }
  return route.path === item.to
}
</script>

<style scoped>
.sidebar {
  width: 15rem;
  background: #022c22;
  color: #e5e7eb;
  display: flex;
  flex-direction: column;
  padding: 1rem 0.75rem;
}

.sidebar-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 0.5rem 1rem 0.5rem;
  border-bottom: 1px solid rgba(148, 163, 184, 0.3);
  margin-bottom: 0.5rem;
}

.logo-circle {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 999px;
  background: linear-gradient(135deg, #16a34a, #22c55e);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.9rem;
  color: #ecfdf3;
}

.sidebar-title {
  display: flex;
  flex-direction: column;
  line-height: 1.1;
}

.sidebar-app {
  font-size: 0.95rem;
  font-weight: 600;
}

.sidebar-sub {
  font-size: 0.75rem;
  color: #9ca3af;
}

.sidebar-nav {
  margin-top: 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.sidebar-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.55rem 0.75rem;
  border-radius: 0.6rem;
  color: #e5e7eb;
  text-decoration: none;
  font-size: 0.9rem;
  transition:
      background-color 0.15s ease,
      color 0.15s ease,
      transform 0.05s ease;
}

.sidebar-link-icon {
  font-size: 1rem;
}

.sidebar-link:hover {
  background: rgba(22, 163, 74, 0.2);
  color: #f9fafb;
  transform: translateX(1px);
}

.sidebar-link-active {
  background: #16a34a;
  color: #f9fafb;
}
</style>
