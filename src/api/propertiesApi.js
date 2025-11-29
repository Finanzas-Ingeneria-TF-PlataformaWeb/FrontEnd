import api from './http'

export function getProperties() {
    return api.get('/properties')
}

export function getProperty(id) {
    return api.get(`/properties/${id}`)
}

export function createProperty(payload) {
    return api.post('/properties', payload)
}

export function updateProperty(id, payload) {
    return api.put(`/properties/${id}`, payload)
}
export function deleteProperty(id) {
    return api.delete(`/properties/${id}`)
}
// NUEVO: subir imagen de una propiedad
export function uploadPropertyImage(id, file) {
    const formData = new FormData()
    formData.append('file', file)

    return api.post(`/properties/${id}/image`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
}
