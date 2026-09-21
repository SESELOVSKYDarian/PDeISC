import { Router } from 'express'
import { query } from '../../services/db.js'
import { toBoolean, toPositiveId } from '../../utils/validators.js'

const router = Router()

router.post('/admin/mensajes/listar', async (req, res, next) => {
  try { res.json({ items: await query('SELECT * FROM mensajes ORDER BY recibido_en DESC') }) } catch (error) { next(error) }
})

router.post('/admin/mensajes/marcar-leido', async (req, res, next) => {
  try {
    const id = toPositiveId(req.body.id)
    if (!id) return res.status(422).json({ message: 'Identificador inválido.' })
    await query('UPDATE mensajes SET leido = ? WHERE id = ?', [toBoolean(req.body.leido), id])
    return res.json({ message: 'Mensaje actualizado.' })
  } catch (error) { return next(error) }
})

router.post('/admin/mensajes/eliminar', async (req, res, next) => {
  try {
    const id = toPositiveId(req.body.id)
    if (!id) return res.status(422).json({ message: 'Identificador inválido.' })
    await query('DELETE FROM mensajes WHERE id = ?', [id])
    return res.json({ message: 'Mensaje eliminado.' })
  } catch (error) { return next(error) }
})

export default router
