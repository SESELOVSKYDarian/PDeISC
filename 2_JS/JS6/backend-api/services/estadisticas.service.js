// junto numeros de ambas tablas para armar el resumen del dashboard del admin
import { PalabraModel } from '../models/palabra.model.js';
import { ScoreModel } from '../models/score.model.js';

export const EstadisticasService = {
  async resumen() {
    const [totalPalabras, porCategoria, totalPartidas, promedioPuntos, mejorPuntaje] = await Promise.all([
      PalabraModel.contarTotal(),
      PalabraModel.contarPorCategoria(),
      ScoreModel.contarTotal(),
      ScoreModel.promedioPuntos(),
      ScoreModel.mejorPuntaje()
    ]);

    return {
      totalPalabras,
      porCategoria,
      totalPartidas,
      promedioPuntos: Number(promedioPuntos).toFixed(1),
      mejorPuntaje
    };
  }
};
