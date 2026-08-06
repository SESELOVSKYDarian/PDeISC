// funciones atomicas de seguridad para no repetir conversiones y comparaciones sensibles
import crypto from 'node:crypto';
import { ENV } from '../config/environment.js';

export function generarToken(bytes = 32) {
  return crypto.randomBytes(bytes).toString('hex');
}

export function generarCodigo() {
  return String(crypto.randomInt(0, 1000000)).padStart(6, '0');
}

export function hashearValor(valor) {
  return crypto.createHmac('sha256', ENV.SESSION_SECRET).update(valor).digest('hex');
}

export function compararValores(valor, hashEsperado) {
  const hashActual = hashearValor(valor);
  return hashActual.length === hashEsperado.length
    && crypto.timingSafeEqual(Buffer.from(hashActual), Buffer.from(hashEsperado));
}

export function sumarMinutos(fecha, minutos) {
  return new Date(fecha.getTime() + minutos * 60 * 1000);
}

export function sumarDias(fecha, dias) {
  return new Date(fecha.getTime() + dias * 24 * 60 * 60 * 1000);
}

export function crearTokenPartida(datos) {
  const contenido = Buffer.from(JSON.stringify(datos)).toString('base64url');
  const firma = hashearValor(contenido);
  return `${contenido}.${firma}`;
}

export function verificarTokenPartida(token) {
  if (typeof token !== 'string') return null;
  const [contenido, firma] = token.split('.');
  if (!contenido || !firma || !compararValores(contenido, firma)) return null;
  try {
    const datos = JSON.parse(Buffer.from(contenido, 'base64url').toString('utf8'));
    if (!datos.expiraEn || Date.now() > datos.expiraEn) return null;
    return datos;
  } catch {
    return null;
  }
}
