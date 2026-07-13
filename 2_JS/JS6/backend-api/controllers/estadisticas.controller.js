// entrega el resumen de estadisticas que consume el dashboard del panel admin
import { EstadisticasService } from '../services/estadisticas.service.js';
import { respuestaOk } from '../utils/respuestas.js';

export const EstadisticasController = {
  async resumen(req, res, next) {
    try {
      const datos = await EstadisticasService.resumen();
      respuestaOk(res, 'Estadísticas obtenidas correctamente.', datos);
    } catch (error) {
      next(error);
    }
  }
};
