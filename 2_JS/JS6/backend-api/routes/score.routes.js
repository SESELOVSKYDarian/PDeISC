import { Router } from 'express';
import { ScoreController } from '../controllers/score.controller.js';
import { validarScore } from '../middlewares/validarScore.js';
import { validarId } from '../middlewares/validarId.js';
import { requerirAdmin } from '../middlewares/requerirAdmin.js';

const router = Router();

router.post('/listar', ScoreController.listar);
router.post('/crear', validarScore, ScoreController.crear);
router.put('/:id', requerirAdmin, validarId, validarScore, ScoreController.actualizar);
router.delete('/:id', requerirAdmin, validarId, ScoreController.eliminar);

export default router;
