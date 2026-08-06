// traduce las operaciones de autenticación a respuestas HTTP simples para el frontend
import { AuthService } from '../services/auth.service.js';
import { respuestaOk } from '../utils/respuestas.js';
import { NOMBRE_COOKIE_SESION_ADMIN } from '../utils/constantes.js';
import { DIAS_SESION_ADMIN } from '../utils/constantes.js';

const opcionesCookie = { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', maxAge: DIAS_SESION_ADMIN * 24 * 60 * 60 * 1000, path: '/' };

export const AuthController = {
  async solicitarCodigo(req, res, next) {
    try { respuestaOk(res, 'Código enviado al mail configurado.', await AuthService.solicitarCodigo(req.body.email, req.body.password)); } catch (error) { next(error); }
  },
  async verificarCodigo(req, res, next) {
    try {
      const datos = await AuthService.verificarCodigo(req.body.email, req.body.codigo);
      res.cookie(NOMBRE_COOKIE_SESION_ADMIN, datos.token, opcionesCookie);
      respuestaOk(res, 'Acceso verificado correctamente.', { fechaExpiracion: datos.fechaExpiracion });
    } catch (error) { next(error); }
  },
  async sesion(req, res) { respuestaOk(res, 'Sesión vigente.', { email: req.admin.email, fechaExpiracion: req.admin.fechaExpiracion }); },
  async cerrarSesion(req, res, next) {
    try { await AuthService.cerrarSesion(req.cookies?.[NOMBRE_COOKIE_SESION_ADMIN]); res.clearCookie(NOMBRE_COOKIE_SESION_ADMIN, { httpOnly: true, sameSite: 'lax', path: '/' }); respuestaOk(res, 'Sesión cerrada correctamente.'); } catch (error) { next(error); }
  }
};
