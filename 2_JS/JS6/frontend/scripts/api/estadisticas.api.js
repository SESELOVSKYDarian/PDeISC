// llamada al resumen de estadisticas para el dashboard del admin
import { API_BASE_URL } from '../config/api.config.js';

export const EstadisticasApi = {
  async resumen() {
    const respuesta = await fetch(`${API_BASE_URL}/estadisticas/resumen`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({})
    });
    const datos = await respuesta.json();
    if (!respuesta.ok || !datos.ok) {
      throw new Error(datos.mensaje || 'No se pudieron obtener las estadísticas.');
    }
    return datos;
  }
};
