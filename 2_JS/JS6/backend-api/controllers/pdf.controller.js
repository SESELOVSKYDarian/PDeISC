// genera los PDFs y los manda como stream de bytes en la respuesta (siempre via POST)
import { PdfService } from '../services/pdf.service.js';
import { ScoreModel } from '../models/score.model.js';
import { calcularResultadoPartida } from '../services/score.service.js';
import { respuestaError } from '../utils/respuestas.js';

export const PdfController = {
  async scoreActual(req, res, next) {
    try {
      const { nombre, fecha, resultado, partidaToken, letrasUtilizadas } = req.body;

      if (!nombre || !partidaToken || !Array.isArray(letrasUtilizadas)) {
        return respuestaError(res, 'Faltan datos para generar el PDF del score.', [], 422);
      }

      const partida = calcularResultadoPartida(partidaToken, letrasUtilizadas);

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename="score-actual.pdf"');

      const doc = PdfService.generarScoreActual({ nombre, puntos: partida.puntos, tiempo: partida.tiempo, fecha, palabra: partida.palabra, dificultad: partida.dificultad, resultado });
      doc.pipe(res);
    } catch (error) {
      next(error);
    }
  },

  async ranking(req, res, next) {
    try {
      const scores = await ScoreModel.listarTodosOrdenados();

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename="ranking.pdf"');

      const doc = PdfService.generarRanking(scores);
      doc.pipe(res);
    } catch (error) {
      next(error);
    }
  }
};
