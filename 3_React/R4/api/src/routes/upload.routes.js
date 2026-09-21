import express, { Router } from 'express'
import { requireAuth } from '../middleware/auth.js'
import { deleteUnusedFiles, fileUrl, saveFile } from '../services/files.js'
import { validateUpload } from '../utils/fileTypes.js'

const router = Router()

// solo el administrador sube archivos; el límite del JSON es mayor que el del resto de la API (el archivo viaja en base64)
router.use(requireAuth)

router.post('/subir', express.json({ limit: '15mb' }), async (req, res, next) => {
  try {
    const upload = validateUpload(req.body)
    if (upload.error) return res.status(422).json({ message: upload.error })

    const id = await saveFile(upload)
    await deleteUnusedFiles().catch((error) => console.error('No se pudo limpiar archivos sin uso:', error.message))
    return res.status(201).json({ message: 'Archivo subido.', url: fileUrl(id) })
  } catch (error) { return next(error) }
})

export default router
