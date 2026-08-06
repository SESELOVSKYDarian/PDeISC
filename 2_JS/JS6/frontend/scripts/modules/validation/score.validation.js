// valida los datos antes de guardar un score
import { validarNombre } from './nombre.validation.js';

export function validarScoreFormulario({ nombre, tiempo, puntos }) {
  const errores = {};
  const resultadoNombre = validarNombre(nombre);
  const tiempoNumero = Number(tiempo);
  const puntosNumero = Number(puntos);

  if (!resultadoNombre.valido) errores.nombre = resultadoNombre.mensaje;
  if (!Number.isSafeInteger(tiempoNumero) || tiempoNumero < 0 || tiempoNumero > 2147483647) errores.tiempo = 'El tiempo debe ser un entero válido.';
  if (!Number.isSafeInteger(puntosNumero) || puntosNumero < 0 || puntosNumero > 2147483647) errores.puntos = 'Los puntos deben ser un entero válido.';

  return { valido: Object.keys(errores).length === 0, errores };
}
