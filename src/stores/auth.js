// src/stores/auth.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { login as loginApi } from '@/api/authApi'

export const useAuthStore = defineStore('auth', () => {
    console.log('"auth" store installed 🆕')

    const token = ref(localStorage.getItem('miv_token') || null)
    const userName = ref(localStorage.getItem('miv_username') || null)

    const isAuthenticated = computed(() => !!token.value)

    async function login({ email, password }) {
        // aquí NO mapeamos nada, solo pasamos email/password
        const { data } = await loginApi({ email, password })
        // data = { token: 'demo-token-superadmin', userName: 'Super Admin' }

        token.value = data.token
        userName.value = data.userName

        localStorage.setItem('miv_token', token.value)
        localStorage.setItem('miv_username', userName.value)
    }

    function logout () {
        token.value = null
        userName.value = null
        localStorage.removeItem('miv_token')
        localStorage.removeItem('miv_username')
    }

    return {
        token,
        userName,
        isAuthenticated,
        login,
        logout
    }
})
