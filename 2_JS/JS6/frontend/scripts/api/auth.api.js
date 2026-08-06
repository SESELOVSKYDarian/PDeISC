// concentra las llamadas de acceso y mantiene la cookie de sesión en el navegador
import { API_BASE_URL } from '../config/api.config.js';

async function manejarRespuesta(respuesta) {
  const datos = await respuesta.json();
  if (!respuesta.ok || !datos.ok) throw new Error(datos.mensaje || 'No se pudo completar el acceso.');
  return datos;
}

export const AuthApi = {
  async solicitarCodigo(email, password) {
    const respuesta = await fetch(`${API_BASE_URL}/auth/solicitar-codigo`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }), credentials: 'include' });
    return manejarRespuesta(respuesta);
  },
  async verificarCodigo(email, codigo) {
    const respuesta = await fetch(`${API_BASE_URL}/auth/verificar-codigo`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, codigo }), credentials: 'include' });
    return manejarRespuesta(respuesta);
  },
  async obtenerSesion() {
    const respuesta = await fetch(`${API_BASE_URL}/auth/sesion`, { credentials: 'include' });
    return manejarRespuesta(respuesta);
  }
};
