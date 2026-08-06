// valido los datos de un puntaje antes de guardarlo en el ranking
import { LONGITUD_MINIMA_NOMBRE, LONGITUD_MAXIMA_NOMBRE, VALOR_MAXIMO_SCORE } from '../utils/constantes.js';

export function validarDatosScore(body = {}) {
  const errores = [];
  const nombre = typeof body.nombre === 'string' ? body.nombre.trim() : '';

  if (!nombre) {
    errores.push('El nombre es obligatorio.');
  } else if (nombre.length < LONGITUD_MINIMA_NOMBRE || nombre.length > LONGITUD_MAXIMA_NOMBRE) {
    errores.push(`El nombre debe tener entre ${LONGITUD_MINIMA_NOMBRE} y ${LONGITUD_MAXIMA_NOMBRE} caracteres.`);
  } else if (!/^[\p{L}\s']+$/u.test(nombre)) {
    errores.push('El nombre solo puede contener letras, espacios y apóstrofes.');
  }

  if (!Number.isSafeInteger(body.tiempo) || body.tiempo < 0 || body.tiempo > VALOR_MAXIMO_SCORE) {
    errores.push(`El tiempo debe ser un entero entre 0 y ${VALOR_MAXIMO_SCORE}.`);
  }

  if (!Number.isSafeInteger(body.puntos) || body.puntos < 0 || body.puntos > VALOR_MAXIMO_SCORE) {
    errores.push(`Los puntos deben ser un entero entre 0 y ${VALOR_MAXIMO_SCORE}.`);
  }

  return { valido: errores.length === 0, errores };
}
