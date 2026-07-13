// este middleware atrapa cualquier error que se me haya escapado en los controllers
// asi la respuesta siempre mantiene el mismo formato y nunca se filtra un stack trace

export function errorHandler(error, req, res, next) {
  console.error('Error no controlado:', error);

  // errores de restricciones de MySQL los traduzco a mensajes entendibles
  if (error.code === 'ER_DUP_ENTRY') {
    return res.status(409).json({
      ok: false,
      mensaje: 'El registro ya existe (dato duplicado).',
      errores: ['Duplicado en base de datos']
    });
  }

  if (error.code === 'ECONNREFUSED' || error.code === 'PROTOCOL_CONNECTION_LOST') {
    return res.status(503).json({
      ok: false,
      mensaje: 'No se pudo conectar con la base de datos.',
      errores: ['MySQL no disponible']
    });
  }

  return res.status(error.status || 500).json({
    ok: false,
    mensaje: 'Ocurrió un error inesperado en el servidor.',
    errores: []
  });
}

// para rutas que no existen
export function rutaNoEncontrada(req, res) {
  res.status(404).json({
    ok: false,
    mensaje: 'La ruta solicitada no existe.',
    errores: [`${req.method} ${req.originalUrl}`]
  });
}
