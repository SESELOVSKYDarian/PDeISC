// si el pedido llega sin cuerpo JSON, usamos un objeto vacío para no romper al leer campos
export function ensureBody(req, _res, next) {
  if (!req.body || typeof req.body !== "object" || Array.isArray(req.body)) req.body = {};
  next();
}
