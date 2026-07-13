// acá está la lógica de negocio de palabras, entre el controller y el modelo
import { PalabraModel } from '../models/palabra.model.js';

export const PalabrasService = {
  async obtenerCategorias() {
    return PalabraModel.obtenerCategorias();
  },

  async listar(filtros) {
    return PalabraModel.listar(filtros);
  },

  async obtenerAleatoria(dificultad, categorias) {
    const palabra = await PalabraModel.aleatoria(dificultad, categorias);
    if (!palabra) {
      const error = new Error('No hay palabras disponibles en la base de datos.');
      error.status = 404;
      throw error;
    }
    return palabra;
  },

  async crear({ palabraLimpia, categoria, dificultad, pista }) {
    const yaExiste = await PalabraModel.existePalabra(palabraLimpia);
    if (yaExiste) {
      const error = new Error('Esa palabra ya existe en la base de datos.');
      error.status = 409;
      throw error;
    }
    const id = await PalabraModel.crear({ palabra: palabraLimpia, categoria: categoria.trim(), dificultad, pista });
    return { id, palabra: palabraLimpia, categoria, dificultad, pista };
  },

  async actualizar(id, { palabraLimpia, categoria, dificultad, pista }) {
    const actualizado = await PalabraModel.actualizar(id, { palabra: palabraLimpia, categoria: categoria.trim(), dificultad, pista });
    if (!actualizado) {
      const error = new Error('No se encontró la palabra a actualizar.');
      error.status = 404;
      throw error;
    }
    return true;
  },

  async eliminar(id) {
    const eliminado = await PalabraModel.eliminar(id);
    if (!eliminado) {
      const error = new Error('No se encontró la palabra a eliminar.');
      error.status = 404;
      throw error;
    }
    return true;
  }
};
