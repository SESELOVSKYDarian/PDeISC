// acá reviso que los datos de una palabra vengan bien antes de tocar la base
import { LONGITUD_MINIMA_PALABRA, LONGITUD_MAXIMA_PALABRA, DIFICULTADES_VALIDAS } from '../utils/constantes.js';
import { limpiarPalabra, esPalabraValida } from '../utils/limpiarPalabra.js';

export function validarDatosPalabra(body) {
  const errores = [];
  const palabraLimpia = limpiarPalabra(body.palabra || '');

  if (!body.palabra || typeof body.palabra !== 'string') {
    errores.push('La palabra es obligatoria y debe ser texto.');
  } else if (!esPalabraValida(palabraLimpia, LONGITUD_MINIMA_PALABRA, LONGITUD_MAXIMA_PALABRA)) {
    errores.push(`La palabra debe tener entre ${LONGITUD_MINIMA_PALABRA} y ${LONGITUD_MAXIMA_PALABRA} letras.`);
  }

  if (!body.categoria || typeof body.categoria !== 'string' || body.categoria.trim().length === 0) {
    errores.push('La categoría es obligatoria.');
  }

  if (body.pista && (typeof body.pista !== 'string' || body.pista.trim().length > 160)) {
    errores.push('La pista debe tener como maximo 160 caracteres.');
  }

  if (body.dificultad && !DIFICULTADES_VALIDAS.includes(body.dificultad)) {
    errores.push('La dificultad debe ser facil, media o dificil.');
  }

  return { valido: errores.length === 0, errores, palabraLimpia };
}
