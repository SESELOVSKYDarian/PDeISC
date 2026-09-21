const request = async (url, body = {}) => {
  const response = await fetch(url, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  })
  const data = await response.json().catch(() => ({}))
  if (!response.ok) {
    const error = new Error(data.message || 'No se pudo completar la operación.')
    error.status = response.status
    error.errors = data.errors
    throw error
  }
  return data
}

export const api = {
  portfolio: () => request('/api/portfolio/obtener'),
  contact: (data) => request('/api/contacto/crear', data),
  login: (data) => request('/api/auth/login', data),
  session: () => request('/api/auth/sesion'),
  logout: () => request('/api/auth/logout'),
  list: (resource) => request(`/api/admin/${resource}/listar`),
  create: (resource, data) => request(`/api/admin/${resource}/crear`, data),
  update: (resource, data) => request(`/api/admin/${resource}/actualizar`, data),
  remove: (resource, id) => request(`/api/admin/${resource}/eliminar`, { id }),
  updateProfile: (data) => request('/api/admin/perfil/actualizar', data),
  markMessage: (id, leido) => request('/api/admin/mensajes/marcar-leido', { id, leido })
}
