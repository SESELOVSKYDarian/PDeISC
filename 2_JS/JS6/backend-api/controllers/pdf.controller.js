// genera los PDFs y los manda como stream de bytes en la respuesta (siempre via POST)
import { PdfService } from '../services/pdf.service.js';
import { ScoreModel } from '../models/score.model.js';
import { respuestaError } from '../utils/respuestas.js';

export const PdfController = {
  async scoreActual(req, res, next) {
    try {
      const { nombre, puntos, tiempo, fecha, palabra, dificultad, resultado } = req.body;

      if (!nombre || puntos === undefined || tiempo === undefined || !palabra) {
        return respuestaError(res, 'Faltan datos para generar el PDF del score.', [], 422);
      }

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename="score-actual.pdf"');

      const doc = PdfService.generarScoreActual({ nombre, puntos, tiempo, fecha, palabra, dificultad, resultado });
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
