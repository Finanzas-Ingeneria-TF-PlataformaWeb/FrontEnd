<template>
  <aside class="sidebar hidden md:flex">
    <div class="sidebar-inner">
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
        <p class="sidebar-section-label">Navegación</p>

        <RouterLink
            v-for="item in items"
            :key="item.to"
            :to="item.to"
            class="sidebar-link"
            :class="{ 'sidebar-link-active': isActive(item) }"
        >
          <span class="sidebar-link-highlight" />
          <span class="sidebar-link-icon-wrapper">
            <i :class="['pi', item.icon, 'sidebar-link-icon']" />
          </span>
          <span class="sidebar-link-text">{{ item.label }}</span>
        </RouterLink>
      </nav>

      <div class="sidebar-footer">
        <div class="sidebar-footer-pill">
          <span class="sidebar-footer-status-dot" />
          <span class="sidebar-footer-text">Sesión activa</span>
        </div>
      </div>
    </div>
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
  width: 16rem;
  background:
      radial-gradient(circle at top, #064e3b 0, #022c22 55%, #011b16 100%);
  color: #e5e7eb;
  display: flex;
  padding: 0.75rem;
  border-right: 1px solid rgba(15, 23, 42, 0.45);
  box-shadow:
      12px 0 30px rgba(15, 23, 42, 0.4),
      1px 0 0 rgba(148, 163, 184, 0.35);
  position: relative;
  overflow: hidden;
}

.sidebar::before {
  content: "";
  position: absolute;
  inset: -40%;
  background:
      radial-gradient(circle at 0% 0%, rgba(74, 222, 128, 0.2), transparent 60%),
      radial-gradient(circle at 100% 100%, rgba(45, 212, 191, 0.16), transparent 60%);
  opacity: 0.9;
  pointer-events: none;
}

.sidebar-inner {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 0.75rem;
  gap: 0.75rem;
}

/* header */

.sidebar-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.65rem 0.55rem 0.9rem;
  border-bottom: 1px solid rgba(148, 163, 184, 0.28);
  margin-bottom: 0.15rem;
}

.logo-circle {
  width: 2.6rem;
  height: 2.6rem;
  border-radius: 999px;
  background: conic-gradient(from 160deg, #22c55e, #4ade80, #22c55e);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 0.9rem;
  color: #ecfdf3;
  box-shadow:
      0 0 0 3px rgba(22, 163, 74, 0.4),
      0 10px 18px rgba(15, 23, 42, 0.55);
}

.sidebar-title {
  display: flex;
  flex-direction: column;
  line-height: 1.1;
}

.sidebar-app {
  font-size: 0.98rem;
  font-weight: 600;
  letter-spacing: 0.02em;
}

.sidebar-sub {
  font-size: 0.76rem;
  color: #9ca3af;
}

/* nav */

.sidebar-nav {
  margin-top: 0.4rem;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  flex: 1;
}

.sidebar-section-label {
  margin: 0 0 0.25rem;
  padding: 0.25rem 0.5rem;
  font-size: 0.68rem;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: rgba(209, 213, 219, 0.75);
}

/* links */

.sidebar-link {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.55rem;
  padding: 0.55rem 0.7rem;
  border-radius: 0.9rem;
  color: #e5e7eb;
  text-decoration: none;
  font-size: 0.88rem;
  font-weight: 500;
  transition:
      background-color 0.18s ease,
      color 0.18s ease,
      transform 0.12s ease,
      box-shadow 0.18s ease;
  overflow: hidden;
}

.sidebar-link::after {
  /* highlight suave al hacer hover/active */
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: radial-gradient(circle at 0 0, rgba(74, 222, 128, 0.3), transparent 60%);
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.18s ease;
}

/* barrita izquierda */

.sidebar-link-highlight {
  position: absolute;
  left: 0.3rem;
  top: 50%;
  transform: translateY(-50%) scaleY(0.4);
  width: 3px;
  height: 60%;
  border-radius: 999px;
  background: linear-gradient(to bottom, #bbf7d0, #4ade80, #22c55e);
  opacity: 0;
  transition:
      opacity 0.18s ease,
      transform 0.18s ease;
}

/* icono + texto */

.sidebar-link-icon-wrapper {
  width: 1.85rem;
  height: 1.85rem;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: rgba(15, 23, 42, 0.6);
  box-shadow: 0 0 0 1px rgba(15, 23, 42, 0.8);
  transition:
      background-color 0.18s ease,
      transform 0.18s ease,
      box-shadow 0.18s ease;
}

.sidebar-link-icon {
  font-size: 1.05rem;
}

.sidebar-link-text {
  white-space: nowrap;
}

/* hover */

.sidebar-link:hover {
  background: rgba(15, 23, 42, 0.4);
  transform: translateX(4px);
  box-shadow: 0 10px 22px rgba(15, 23, 42, 0.55);
}

.sidebar-link:hover::after {
  opacity: 1;
}

.sidebar-link:hover .sidebar-link-icon-wrapper {
  background: rgba(22, 163, 74, 0.2);
  box-shadow:
      0 0 0 1px rgba(74, 222, 128, 0.8),
      0 8px 16px rgba(22, 163, 74, 0.45);
  transform: scale(1.05);
}

/* active */

.sidebar-link-active {
  background: linear-gradient(135deg, rgba(22, 163, 74, 0.95), rgba(21, 128, 61, 0.97));
  color: #f9fafb;
  box-shadow:
      0 14px 26px rgba(22, 163, 74, 0.6),
      0 0 0 1px rgba(134, 239, 172, 0.85);
  transform: translateX(4px);
}

.sidebar-link-active::after {
  opacity: 0.8;
}

.sidebar-link-active .sidebar-link-highlight {
  opacity: 1;
  transform: translateY(-50%) scaleY(1);
}

.sidebar-link-active .sidebar-link-icon-wrapper {
  background: rgba(15, 23, 42, 0.85);
  box-shadow:
      0 0 0 1px rgba(209, 250, 229, 0.9),
      0 8px 18px rgba(15, 23, 42, 0.8);
}

/* footer */

.sidebar-footer {
  margin-top: auto;
  padding-top: 0.75rem;
  border-top: 1px solid rgba(15, 23, 42, 0.9);
}

.sidebar-footer-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.3rem 0.65rem;
  border-radius: 999px;
  background: rgba(15, 23, 42, 0.85);
  box-shadow: 0 10px 20px rgba(15, 23, 42, 0.8);
  font-size: 0.75rem;
  color: #d1fae5;
}

.sidebar-footer-status-dot {
  width: 0.45rem;
  height: 0.45rem;
  border-radius: 999px;
  background: radial-gradient(circle, #22c55e, #16a34a);
  box-shadow: 0 0 0 4px rgba(34, 197, 94, 0.3);
}

.sidebar-footer-text {
  white-space: nowrap;
}

/* responsivo mínimo */

@media (max-height: 640px) {
  .sidebar-nav {
    overflow-y: auto;
  }
}
</style>
