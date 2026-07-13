// reviso que el :id de la URL sea un numero entero valido, para no pasarle basura a MySQL
import { respuestaError } from '../utils/respuestas.js';

export function validarId(req, res, next) {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return respuestaError(res, 'El ID indicado no es válido.', ['ID debe ser un entero positivo'], 400);
  }

  req.idValidado = id;
  next();
}
