import axios from 'axios'

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5137/api'

const api = axios.create({
    baseURL,
    timeout: 15000,
    headers: { 'Content-Type': 'application/json' }
})

api.interceptors.request.use(
    config => {
        const token = localStorage.getItem('miv_token')
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    error => Promise.reject(error)
)

export default api
