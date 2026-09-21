// error "esperado" del ingreso con redes: lleva el código HTTP y un mensaje para mostrar
export class OAuthError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

// responde con el mensaje si es un OAuthError; si no, lo pasa al manejador general
export function sendOAuthError(error, res, next) {
  if (error instanceof OAuthError) return res.status(error.status).json({ message: error.message });
  next(error);
}
