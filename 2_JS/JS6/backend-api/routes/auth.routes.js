// rutas públicas y privadas del acceso al panel administrador
import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller.js';
import { requerirAdmin } from '../middlewares/requerirAdmin.js';

const router = Router();
router.post('/solicitar-codigo', AuthController.solicitarCodigo);
router.post('/verificar-codigo', AuthController.verificarCodigo);
router.get('/sesion', requerirAdmin, AuthController.sesion);
router.post('/cerrar-sesion', requerirAdmin, AuthController.cerrarSesion);
export default router;
