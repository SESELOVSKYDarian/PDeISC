// coordina credenciales, segundo factor por correo y sesiones de siete días
import { ENV } from '../config/environment.js';
import { AuthModel } from '../models/auth.model.js';
import { MailerService } from './mailer.service.js';
import { DIAS_SESION_ADMIN, LONGITUD_CODIGO_VERIFICACION } from '../utils/constantes.js';
import { compararValores, generarCodigo, generarToken, hashearValor, sumarDias, sumarMinutos } from '../utils/seguridad.js';

function validarConfiguracion() {
  if (!ENV.ADMIN_EMAIL || !ENV.ADMIN_PASSWORD) throw Object.assign(new Error('El administrador no está configurado.'), { status: 500 });
}

function validarEmail(email) {
  return typeof email === 'string' && email.trim().toLowerCase() === ENV.ADMIN_EMAIL.trim().toLowerCase();
}

export const AuthService = {
  async solicitarCodigo(email, password) {
    validarConfiguracion();
    if (!validarEmail(email) || password !== ENV.ADMIN_PASSWORD) throw Object.assign(new Error('El mail o la contraseña no son correctos.'), { status: 401 });
    const codigo = generarCodigo();
    await AuthModel.guardarCodigo(ENV.ADMIN_EMAIL.toLowerCase(), hashearValor(codigo), sumarMinutos(new Date(), ENV.AUTH_CODE_MINUTES));
    await MailerService.enviarCodigo(ENV.ADMIN_EMAIL, codigo);
    return { email: ENV.ADMIN_EMAIL, minutosVigencia: ENV.AUTH_CODE_MINUTES };
  },

  async verificarCodigo(email, codigo) {
    validarConfiguracion();
    if (!validarEmail(email) || new RegExp(`^\\d{${LONGITUD_CODIGO_VERIFICACION}}$`).test(codigo || '') === false) throw Object.assign(new Error('El código ingresado no es válido.'), { status: 401 });
    const registro = await AuthModel.obtenerCodigoVigente(ENV.ADMIN_EMAIL.toLowerCase());
    if (!registro || new Date(registro.fecha_expiracion) <= new Date() || !compararValores(codigo, registro.codigo_hash)) throw Object.assign(new Error('El código es incorrecto o ya venció.'), { status: 401 });
    await AuthModel.marcarCodigoUsado(registro.id);
    const token = generarToken();
    const fechaExpiracion = sumarDias(new Date(), DIAS_SESION_ADMIN);
    await AuthModel.crearSesion(hashearValor(token), ENV.ADMIN_EMAIL.toLowerCase(), fechaExpiracion);
    return { token, fechaExpiracion };
  },

  async validarSesion(token) {
    return token ? AuthModel.obtenerSesion(hashearValor(token)) : null;
  },

  async cerrarSesion(token) {
    if (token) await AuthModel.eliminarSesion(hashearValor(token));
  }
};
