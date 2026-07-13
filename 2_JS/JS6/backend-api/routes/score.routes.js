import { Router } from 'express';
import { ScoreController } from '../controllers/score.controller.js';
import { validarScore } from '../middlewares/validarScore.js';
import { validarId } from '../middlewares/validarId.js';

const router = Router();

router.post('/listar', ScoreController.listar);
router.post('/crear', validarScore, ScoreController.crear);
router.put('/:id', validarId, validarScore, ScoreController.actualizar);
router.delete('/:id', validarId, ScoreController.eliminar);

export default router;
