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
