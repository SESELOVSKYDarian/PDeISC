export const notFound = (req, res) => res.status(404).json({ message: 'Ruta inexistente.' })

export const errorHandler = (error, req, res, next) => {
  if (res.headersSent) return next(error)
  console.error(error)
  if (error.code === 'ER_DUP_ENTRY') {
    return res.status(409).json({ message: 'Ya existe un registro con esos datos.' })
  }
  if (error.code === 'ER_ROW_IS_REFERENCED_2') {
    return res.status(409).json({ message: 'No podés eliminar una categoría que todavía tiene habilidades.' })
  }
  if (error.code === 'ER_BAD_DB_ERROR' || error.code === 'ER_NO_SUCH_TABLE') {
    return res.status(503).json({ message: 'La base todavía no está inicializada. Ejecutá npm run db:prepare.' })
  }
  if (['ECONNREFUSED', 'PROTOCOL_CONNECTION_LOST', 'ETIMEDOUT'].includes(error.code)) {
    return res.status(503).json({ message: 'No se pudo conectar con MySQL. Comprobá que el servicio esté iniciado.' })
  }
  return res.status(error.status || 500).json({ message: error.status ? error.message : 'Ocurrió un error interno.' })
}
