// bloquea las operaciones privadas cuando no existe una sesión válida
import { AuthService } from '../services/auth.service.js';
import { NOMBRE_COOKIE_SESION_ADMIN } from '../utils/constantes.js';

export async function requerirAdmin(req, res, next) {
  try {
    const sesion = await AuthService.validarSesion(req.cookies?.[NOMBRE_COOKIE_SESION_ADMIN]);
    if (!sesion) return res.status(401).json({ ok: false, mensaje: 'La sesión del administrador venció o no existe.', errores: [] });
    req.admin = { email: sesion.email, fechaExpiracion: sesion.fecha_expiracion };
    next();
  } catch (error) { next(error); }
}
