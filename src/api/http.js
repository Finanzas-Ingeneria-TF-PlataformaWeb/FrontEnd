// src/api/http.js
import axios from 'axios'

/**
 * baseURL final del API
 * - Si existe VITE_API_URL, se usa esa.
 * - Si no existe y estamos en development, usa localhost.
 * - Si no existe y estamos en producción (Vercel), usa Render.
 */
const baseURL =
    import.meta.env.VITE_API_URL ??
    (import.meta.env.MODE === 'development'
        ? 'http://localhost:5137/api'
        : 'https://mivivienda-api.onrender.com/api')

console.log('[API] baseURL en runtime:', baseURL)

// Normalizamos para evitar barras dobles
const API_BASE = baseURL.replace(/\/$/, '')

// Origen del backend SIN /api  (ej: https://mivivienda-api.onrender.com)
export const API_ORIGIN = API_BASE.replace(/\/api$/i, '')

/**
 * Helper para construir URLs de imágenes
 * - Si viene null/vacío → retorna null (para que entre al fallback del componente)
 * - Si ya es http(s) → se respeta
 * - Si es relativo (ej: /uploads/xxx.jpg o solo nombre) → se prefixea con el backend
 */
export const buildImageUrl = (path) => {
    if (!path) {
        return null
    }

    // Si ya viene con esquema http/https, la dejamos tal cual
    if (/^https?:\/\//i.test(path)) {
        return path
    }

    // Aseguramos que empiece con /
    const normalized = path.startsWith('/') ? path : `/${path}`

    // Resultado final: https://mivivienda-api.onrender.com/<ruta>
    return `${API_ORIGIN}${normalized}`
}

// Instancia de Axios
const api = axios.create({
    baseURL: API_BASE,
    timeout: 15000,
    headers: { 'Content-Type': 'application/json' }
})

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('miv_token')
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => Promise.reject(error)
)

export default api
