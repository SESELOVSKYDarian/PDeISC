// todas las rutas de palabras usan POST/PUT/DELETE, nunca GET
import { Router } from 'express';
import { PalabrasController } from '../controllers/palabras.controller.js';
import { validarPalabra } from '../middlewares/validarPalabra.js';
import { validarId } from '../middlewares/validarId.js';

const router = Router();

router.post('/listar', PalabrasController.listar);
router.get('/categorias', PalabrasController.categorias);
router.post('/aleatoria', PalabrasController.aleatoria);
router.post('/crear', validarPalabra, PalabrasController.crear);
router.put('/:id', validarId, validarPalabra, PalabrasController.actualizar);
router.delete('/:id', validarId, PalabrasController.eliminar);

export default router;
