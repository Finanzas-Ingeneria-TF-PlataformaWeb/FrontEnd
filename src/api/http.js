import axios from 'axios'

/**
 * URL base de la API:
 * - Si existe VITE_API_URL, se usa esa.
 * - Si no existe y estamos en development, usa localhost.
 * - Si no existe y estamos en producción (Vercel), usa directamente Render.
 */
const baseURL =
    import.meta.env.VITE_API_URL ??
    (import.meta.env.MODE === 'development'
        ? 'http://localhost:5137/api'
        : 'https://mivivienda-api.onrender.com/api')

console.log('[API] baseURL en runtime:', baseURL)

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
