// llamadas relacionadas al ranking de puntajes
import { API_BASE_URL } from '../config/api.config.js';

async function manejarRespuesta(respuesta) {
  const datos = await respuesta.json();
  if (!respuesta.ok || !datos.ok) {
    throw new Error(datos.mensaje || 'Ocurrió un error al comunicarse con la API.');
  }
  return datos;
}

export const ScoreApi = {
  async listar(filtros = {}) {
    const respuesta = await fetch(`${API_BASE_URL}/score/listar`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(filtros)
    });
    return manejarRespuesta(respuesta);
  },

  async crear(datos) {
    const respuesta = await fetch(`${API_BASE_URL}/score/crear`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos)
    });
    return manejarRespuesta(respuesta);
  },

  async actualizar(id, datos) {
    const respuesta = await fetch(`${API_BASE_URL}/score/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos)
    });
    return manejarRespuesta(respuesta);
  },

  async eliminar(id) {
    const respuesta = await fetch(`${API_BASE_URL}/score/${id}`, { method: 'DELETE' });
    return manejarRespuesta(respuesta);
  }
};
