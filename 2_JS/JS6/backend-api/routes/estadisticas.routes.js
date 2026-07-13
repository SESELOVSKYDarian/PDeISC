import { Router } from 'express';
import { EstadisticasController } from '../controllers/estadisticas.controller.js';

const router = Router();

router.post('/resumen', EstadisticasController.resumen);

export default router;
