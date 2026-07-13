// corto la petición acá mismo si los datos de la palabra vienen mal
import { validarDatosPalabra } from '../validators/palabra.validator.js';
import { respuestaError } from '../utils/respuestas.js';

export function validarPalabra(req, res, next) {
  const { valido, errores, palabraLimpia } = validarDatosPalabra(req.body);

  if (!valido) {
    return respuestaError(res, 'Los datos de la palabra no son válidos.', errores, 422);
  }

  // dejo la palabra ya limpia lista para el controller
  req.body.palabraLimpia = palabraLimpia;
  next();
}
