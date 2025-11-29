// src/api/authApi.js
import api from './http'

export function login(credentials) {
    // credentials = { email, password }

    return api.post('/auth/login', {
        username: credentials.email,   // lo que espera el backend
        password: credentials.password
    })
}
