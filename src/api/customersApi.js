// src/api/customersApi.js
import api from './http'

export function getCustomers() {
    return api.get('/customers')
}

export function getCustomer(id) {
    return api.get(`/customers/${id}`)
}

export function createCustomer(payload) {
    return api.post('/customers', payload)
}

export function updateCustomer(id, payload) {
    return api.put(`/customers/${id}`, payload)
}

export function deleteCustomer(id) {
    return api.delete(`/customers/${id}`)
}
