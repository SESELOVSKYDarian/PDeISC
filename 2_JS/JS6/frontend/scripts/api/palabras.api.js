// todas las llamadas relacionadas a palabras, siempre via POST/PUT/DELETE
import { API_BASE_URL } from '../config/api.config.js';

async function manejarRespuesta(respuesta) {
  const datos = await respuesta.json();
  if (!respuesta.ok || !datos.ok) {
    throw new Error(datos.mensaje || 'Ocurrió un error al comunicarse con la API.');
  }
  return datos;
}

export const PalabrasApi = {
  async categorias() {
    const respuesta = await fetch(`${API_BASE_URL}/palabras/listar`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({})
    });
    const datos = await manejarRespuesta(respuesta);
    return {
      ...datos,
      datos: {
        categorias: [...new Set(datos.datos.palabras.map(item => item.categoria))].sort()
      }
    };
  },

  async listar(filtros = {}) {
    const respuesta = await fetch(`${API_BASE_URL}/palabras/listar`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(filtros)
    });
    return manejarRespuesta(respuesta);
  },

  async aleatoria(dificultad, categorias = []) {
    const respuesta = await fetch(`${API_BASE_URL}/palabras/aleatoria`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ dificultad, categorias })
    });
    return manejarRespuesta(respuesta);
  },

  async crear(datos) {
    const respuesta = await fetch(`${API_BASE_URL}/palabras/crear`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos)
    });
    return manejarRespuesta(respuesta);
  },

  async actualizar(id, datos) {
    const respuesta = await fetch(`${API_BASE_URL}/palabras/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos)
    });
    return manejarRespuesta(respuesta);
  },

  async eliminar(id) {
    const respuesta = await fetch(`${API_BASE_URL}/palabras/${id}`, { method: 'DELETE' });
    return manejarRespuesta(respuesta);
  }
};
