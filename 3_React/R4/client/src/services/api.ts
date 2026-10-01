import { fileToBase64 } from '../utils/fileToBase64'
import type { AdminSession } from '../types/admin'

export class ApiError extends Error {
  status?: number;
  errors?: Record<string, string>;
}

const request = async <T = any>(url: string, body: object = {}): Promise<T> => {
  const response = await fetch(url, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  })
  const data = await response.json().catch(() => ({}))
  if (!response.ok) {
    const error = new ApiError(data.message || 'No se pudo completar la operación.')
    error.status = response.status
    error.errors = data.errors
    throw error
  }
  return data
}

export const api = {
  portfolio: () => request('/api/portfolio/obtener'),
  contact: (data: object) => request('/api/contacto/crear', data),
  login: (data: object) => request('/api/auth/login', data),
  session: () => request('/api/auth/sesion'),
  updateAccount: (data: object) => request<{ message: string; admin: AdminSession }>('/api/auth/cuenta/actualizar', data),
  logout: () => request('/api/auth/logout'),
  list: (resource: string, data: object = {}) => request(`/api/admin/${resource}/listar`, data),
  create: (resource: string, data: object) => request(`/api/admin/${resource}/crear`, data),
  update: (resource: string, data: object) => request(`/api/admin/${resource}/actualizar`, data),
  remove: (resource: string, id: number) => request(`/api/admin/${resource}/eliminar`, { id }),
  updateProfile: (data: object) => request('/api/admin/perfil/actualizar', data),
  upload: async (tipo: string, file: File) => request<{ message: string; url: string }>('/api/admin/archivos/subir', { tipo, nombre: file.name, contenido: await fileToBase64(file) }),
  reorder: (resource: string, ids: number[]) => request(`/api/admin/${resource}/ordenar`, { ids }),
  markMessage: (id: number, leido: boolean) => request('/api/admin/mensajes/marcar-leido', { id, leido }),
  markAllMessages: () => request('/api/admin/mensajes/marcar-todos-leidos'),
  removeAllMessages: () => request('/api/admin/mensajes/eliminar-todos')
}
