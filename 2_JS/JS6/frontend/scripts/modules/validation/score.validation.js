// valida los datos antes de guardar un score
import { validarNombre } from './nombre.validation.js';

export function validarScoreFormulario({ nombre, tiempo, puntos }) {
  const errores = {};

  const resultadoNombre = validarNombre(nombre);
  if (!resultadoNombre.valido) errores.nombre = resultadoNombre.mensaje;

  if (isNaN(tiempo) || Number(tiempo) < 0) {
    errores.tiempo = 'El tiempo debe ser un número positivo.';
  }
  if (isNaN(puntos) || Number(puntos) < 0) {
    errores.puntos = 'Los puntos deben ser un número positivo.';
  }

  return { valido: Object.keys(errores).length === 0, errores };
}
