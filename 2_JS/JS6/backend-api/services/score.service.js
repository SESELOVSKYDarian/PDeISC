// lógica de negocio del ranking de puntajes
import { ScoreModel } from '../models/score.model.js';

export const ScoreService = {
  async listar(filtros) {
    return ScoreModel.listar(filtros);
  },

  async crear({ nombre, tiempo, puntos }) {
    const id = await ScoreModel.crear({ nombre: nombre.trim(), tiempo: Number(tiempo), puntos: Number(puntos) });
    return { id, nombre, tiempo, puntos };
  },

  async actualizar(id, { nombre, tiempo, puntos }) {
    const actualizado = await ScoreModel.actualizar(id, { nombre: nombre.trim(), tiempo: Number(tiempo), puntos: Number(puntos) });
    if (!actualizado) {
      const error = new Error('No se encontró el score a actualizar.');
      error.status = 404;
      throw error;
    }
    return true;
  },

  async eliminar(id) {
    const eliminado = await ScoreModel.eliminar(id);
    if (!eliminado) {
      const error = new Error('No se encontró el score a eliminar.');
      error.status = 404;
      throw error;
    }
    return true;
  }
};
