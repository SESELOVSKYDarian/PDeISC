// acá conecto las peticiones HTTP con el service de palabras
import { PalabrasService } from '../services/palabras.service.js';
import { respuestaOk } from '../utils/respuestas.js';

export const PalabrasController = {
  async categorias(req, res, next) {
    try {
      const categorias = await PalabrasService.obtenerCategorias();
      respuestaOk(res, 'Categorias obtenidas correctamente.', { categorias });
    } catch (error) {
      next(error);
    }
  },

  async listar(req, res, next) {
    try {
      const { categoria, dificultad, busqueda } = req.body;
      const palabras = await PalabrasService.listar({ categoria, dificultad, busqueda });
      respuestaOk(res, 'Palabras obtenidas correctamente.', { palabras, total: palabras.length });
    } catch (error) {
      next(error);
    }
  },

  async aleatoria(req, res, next) {
    try {
      const { dificultad, categorias } = req.body;
      const palabra = await PalabrasService.obtenerAleatoria(dificultad, categorias);
      respuestaOk(res, 'Palabra obtenida correctamente.', { palabra });
    } catch (error) {
      next(error);
    }
  },

  async crear(req, res, next) {
    try {
      const { palabraLimpia, categoria, dificultad, pista } = req.body;
      const creada = await PalabrasService.crear({ palabraLimpia, categoria, dificultad, pista });
      respuestaOk(res, 'Palabra creada correctamente.', { palabra: creada }, 201);
    } catch (error) {
      next(error);
    }
  },

  async actualizar(req, res, next) {
    try {
      const { palabraLimpia, categoria, dificultad, pista } = req.body;
      await PalabrasService.actualizar(req.idValidado, { palabraLimpia, categoria, dificultad, pista });
      respuestaOk(res, 'Palabra actualizada correctamente.');
    } catch (error) {
      next(error);
    }
  },

  async eliminar(req, res, next) {
    try {
      await PalabrasService.eliminar(req.idValidado);
      respuestaOk(res, 'Palabra eliminada correctamente.');
    } catch (error) {
      next(error);
    }
  }
};
