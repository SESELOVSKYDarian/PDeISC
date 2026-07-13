// conecta las peticiones HTTP del ranking con el service correspondiente
import { ScoreService } from '../services/score.service.js';
import { respuestaOk } from '../utils/respuestas.js';

export const ScoreController = {
  async listar(req, res, next) {
    try {
      const { orden, direccion, busqueda, pagina, porPagina } = req.body;
      const { filas, total } = await ScoreService.listar({ orden, direccion, busqueda, pagina, porPagina });
      respuestaOk(res, 'Ranking obtenido correctamente.', {
        scores: filas,
        total,
        pagina: pagina || 1,
        porPagina: porPagina || 10
      });
    } catch (error) {
      next(error);
    }
  },

  async crear(req, res, next) {
    try {
      const { nombre, tiempo, puntos } = req.body;
      const creado = await ScoreService.crear({ nombre, tiempo, puntos });
      respuestaOk(res, 'Score guardado correctamente.', { score: creado }, 201);
    } catch (error) {
      next(error);
    }
  },

  async actualizar(req, res, next) {
    try {
      const { nombre, tiempo, puntos } = req.body;
      await ScoreService.actualizar(req.idValidado, { nombre, tiempo, puntos });
      respuestaOk(res, 'Score actualizado correctamente.');
    } catch (error) {
      next(error);
    }
  },

  async eliminar(req, res, next) {
    try {
      await ScoreService.eliminar(req.idValidado);
      respuestaOk(res, 'Score eliminado correctamente.');
    } catch (error) {
      next(error);
    }
  }
};
