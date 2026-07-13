// corto la petición si el score que quieren guardar no es válido
import { validarDatosScore } from '../validators/score.validator.js';
import { respuestaError } from '../utils/respuestas.js';

export function validarScore(req, res, next) {
  const { valido, errores } = validarDatosScore(req.body);

  if (!valido) {
    return respuestaError(res, 'Los datos del score no son válidos.', errores, 422);
  }

  next();
}
