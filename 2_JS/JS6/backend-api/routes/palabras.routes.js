// todas las rutas de palabras usan POST/PUT/DELETE, nunca GET
import { Router } from 'express';
import { PalabrasController } from '../controllers/palabras.controller.js';
import { validarPalabra } from '../middlewares/validarPalabra.js';
import { validarId } from '../middlewares/validarId.js';
import { requerirAdmin } from '../middlewares/requerirAdmin.js';

const router = Router();

router.post('/listar', PalabrasController.listar);
router.post('/categorias', PalabrasController.categorias);
router.post('/aleatoria', PalabrasController.aleatoria);
router.post('/crear', requerirAdmin, validarPalabra, PalabrasController.crear);
router.put('/:id', requerirAdmin, validarId, validarPalabra, PalabrasController.actualizar);
router.delete('/:id', requerirAdmin, validarId, PalabrasController.eliminar);

export default router;
