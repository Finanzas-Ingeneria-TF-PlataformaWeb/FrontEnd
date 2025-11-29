import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

import AuthLayout from '@/layouts/AuthLayout.vue'
import MainLayout from '@/layouts/MainLayout.vue'

import LoginView from '@/views/auth/LoginView.vue'
import DashboardView from '@/views/dashboard/DashboardView.vue'
import CustomersListView from '@/views/customers/CustomersListView.vue'
import CustomerFormView from '@/views/customers/CustomerFormView.vue'
import PropertiesListView from '@/views/properties/PropertiesListView.vue'
import PropertyFormView from '@/views/properties/PropertyFormView.vue'
import SimulationConfigView from '@/views/simulations/SimulationConfigView.vue'
import SimulationResultView from '@/views/simulations/SimulationResultView.vue'
import FinancialConfigView from '@/views/settings/FinancialConfigView.vue'
import SimulationListView from '@/views/simulations/SimulationListView.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        // Login con layout de autenticación
        {
            path: '/login',
            component: AuthLayout,
            children: [
                {
                    path: '',
                    name: 'login',
                    component: LoginView
                }
            ]
        },

        // App principal
        {
            path: '/',
            component: MainLayout,
            meta: { requiresAuth: true },
            children: [
                {
                    path: '',
                    name: 'dashboard',
                    component: DashboardView
                },
                {
                    path: 'customers',
                    name: 'customers',
                    component: CustomersListView
                },
                {
                    path: 'customers/new',
                    name: 'customer-new',
                    component: CustomerFormView
                },
                {
                    path: 'customers/:id/edit',
                    name: 'customer-edit',
                    component: CustomerFormView,
                    props: true
                },
                {
                    path: 'properties',
                    name: 'properties',
                    component: PropertiesListView
                },
                {
                    path: 'properties/new',
                    name: 'property-new',
                    component: PropertyFormView
                },
                {
                    path: 'properties/:id/edit',
                    name: 'property-edit',
                    component: PropertyFormView,
                    props: true
                },
                {
                    path: 'simulations/config',
                    name: 'simulations-config',
                    component: SimulationConfigView
                },
                {
                    path: '/simulations',
                    name: 'simulations-list',
                    component: SimulationListView
                },
                {
                    path: 'simulations/result/:id',
                    name: 'simulations-result',
                    component: SimulationResultView,
                    props: true
                },

                {
                    path: 'settings/financial',
                    name: 'settings-financial',
                    component: FinancialConfigView
                }
            ]
        },

        // Cualquier ruta desconocida redirige al dashboard
        {
            path: '/:pathMatch(.*)*',
            redirect: '/'
        }
    ]
})

// Guard de autenticación sencillo
router.beforeEach((to, from, next) => {
    const auth = useAuthStore()

    // Si ya está logueado y entra a /login, lo mando al dashboard
    if (to.name === 'login' && auth.isAuthenticated) {
        next({ name: 'dashboard' })
        return
    }

    // Si la ruta requiere login y no está autenticado, lo mando a /login
    if (to.meta.requiresAuth && !auth.isAuthenticated) {
        next({ name: 'login' })
        return
    }

    next()
})

export default router
