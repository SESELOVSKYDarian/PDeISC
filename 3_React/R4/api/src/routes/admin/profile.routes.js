import { Router } from 'express'
import { query } from '../../services/db.js'
import { cleanText, isEmail, isUrl } from '../../utils/validators.js'

const router = Router()

const fields = ['nombre', 'rol', 'saludo', 'presentacion', 'descripcion', 'ubicacion', 'email', 'disponibilidad', 'retrato_url', 'cv_url', 'favicon_url']

const parseProfile = (body) => ({
  nombre: cleanText(body.nombre, 80),
  rol: cleanText(body.rol, 120),
  saludo: cleanText(body.saludo, 120),
  presentacion: cleanText(body.presentacion, 500),
  descripcion: cleanText(body.descripcion, 4000),
  ubicacion: cleanText(body.ubicacion, 120),
  email: cleanText(body.email, 160),
  disponibilidad: cleanText(body.disponibilidad, 120),
  retrato_url: cleanText(body.retrato_url, 500),
  cv_url: cleanText(body.cv_url, 500),
  favicon_url: cleanText(body.favicon_url, 500)
})

// el retrato es obligatorio; el CV y el favicon son opcionales
const isValidProfile = (data) => data.nombre.length >= 2 && data.rol.length >= 2 && data.presentacion.length >= 10
  && isEmail(data.email) && Boolean(data.retrato_url) && isUrl(data.retrato_url) && isUrl(data.cv_url) && isUrl(data.favicon_url)

router.post('/admin/perfil/listar', async (req, res, next) => {
  try {
    const [item] = await query('SELECT * FROM perfil WHERE id = 1')
    res.json({ item })
  } catch (error) { next(error) }
})

router.post('/admin/perfil/actualizar', async (req, res, next) => {
  try {
    const data = parseProfile(req.body)
    if (!isValidProfile(data)) return res.status(422).json({ message: 'Revisá los datos del perfil.' })
    await query(`UPDATE perfil SET ${fields.map((field) => `${field} = ?`).join(', ')} WHERE id = 1`, fields.map((field) => data[field]))
    return res.json({ message: 'Perfil actualizado.' })
  } catch (error) { return next(error) }
})

export default router
