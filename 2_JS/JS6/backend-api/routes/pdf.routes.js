import { Router } from 'express';
import { PdfController } from '../controllers/pdf.controller.js';

const router = Router();

router.post('/score-actual', PdfController.scoreActual);
router.post('/ranking', PdfController.ranking);

export default router;
