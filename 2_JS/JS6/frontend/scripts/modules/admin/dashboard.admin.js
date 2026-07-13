// carga las estadisticas del dashboard al entrar al panel admin
import { EstadisticasApi } from '../../api/estadisticas.api.js';
import { renderizarEstadisticas } from '../render/estadisticas.render.js';
import { mostrarToast } from '../ui/toast.js';

export async function cargarDashboard() {
  try {
    const respuesta = await EstadisticasApi.resumen();
    renderizarEstadisticas(respuesta.datos);
  } catch {
    mostrarToast('No se pudieron cargar las estadísticas del dashboard.', 'error');
  }
}
