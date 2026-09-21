import { Router } from 'express'
import { findFile } from '../services/files.js'
import { toPositiveId } from '../utils/validators.js'

const router = Router()

// dirección pública de los archivos subidos (funciona como un recurso estático: la usan <img> y los enlaces de descarga)
router.get('/:id', async (req, res, next) => {
  try {
    const id = toPositiveId(req.params.id)
    const file = id ? await findFile(id) : null
    if (!file) return res.status(404).json({ message: 'Archivo inexistente.' })

    res.set({
      'Content-Type': file.tipo_mime,
      'Content-Disposition': `inline; filename*=UTF-8''${encodeURIComponent(file.nombre)}`,
      'X-Content-Type-Options': 'nosniff',
      'Cache-Control': 'public, max-age=31536000, immutable'
    })
    return res.send(file.contenido)
  } catch (error) { return next(error) }
})

export default router
