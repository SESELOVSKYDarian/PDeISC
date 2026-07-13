// valido los datos de un puntaje antes de guardarlo en el ranking
import { LONGITUD_MINIMA_NOMBRE, LONGITUD_MAXIMA_NOMBRE } from '../utils/constantes.js';

export function validarDatosScore(body) {
  const errores = [];

  if (!body.nombre || typeof body.nombre !== 'string' || body.nombre.trim().length === 0) {
    errores.push('El nombre es obligatorio.');
  } else if (body.nombre.trim().length < LONGITUD_MINIMA_NOMBRE || body.nombre.trim().length > LONGITUD_MAXIMA_NOMBRE) {
    errores.push(`El nombre debe tener entre ${LONGITUD_MINIMA_NOMBRE} y ${LONGITUD_MAXIMA_NOMBRE} caracteres.`);
  } else if (!/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s]+$/.test(body.nombre.trim())) {
    errores.push('El nombre solo puede contener letras, números y espacios.');
  }

  if (body.tiempo === undefined || body.tiempo === null || isNaN(body.tiempo) || Number(body.tiempo) < 0) {
    errores.push('El tiempo debe ser un número positivo.');
  }

  if (body.puntos === undefined || body.puntos === null || isNaN(body.puntos) || Number(body.puntos) < 0) {
    errores.push('Los puntos deben ser un número positivo.');
  }

  return { valido: errores.length === 0, errores };
}
