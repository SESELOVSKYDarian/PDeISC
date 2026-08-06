import { Router } from 'express';
import { EstadisticasController } from '../controllers/estadisticas.controller.js';
import { requerirAdmin } from '../middlewares/requerirAdmin.js';

const router = Router();

router.post('/resumen', requerirAdmin, EstadisticasController.resumen);

export default router;
