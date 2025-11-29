// src/api/simulationsApi.js
// ya tienes:
import api from './http'

export function calculateSimulation(payload) {
    return api.post('/simulations', payload)
}

export function getSimulation(id) {
    return api.get(`/simulations/${id}`)
}

// NUEVO: listar historial
export function listSimulations(params) {
    // params puede llevar { customerId: 1 } o nada
    return api.get('/simulations', { params })
}
