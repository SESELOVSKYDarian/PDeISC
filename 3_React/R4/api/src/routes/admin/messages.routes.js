import { Router } from 'express'
import { query } from '../../services/db.js'
import { toBoolean, toPositiveId } from '../../utils/validators.js'

const router = Router()

router.post('/admin/mensajes/listar', async (req, res, next) => {
  try {
    const requestedPage = Number.parseInt(req.body.page, 10) || 1
    const requestedLimit = Number.parseInt(req.body.limit, 10) || 8
    const pageSize = Math.min(Math.max(requestedLimit, 1), 50)
    const [{ total }] = await query('SELECT COUNT(*) AS total FROM mensajes')
    const [{ unread }] = await query('SELECT COUNT(*) AS unread FROM mensajes WHERE leido = 0')
    const totalItems = Number(total)
    const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))
    const page = Math.min(Math.max(requestedPage, 1), totalPages)
    const offset = (page - 1) * pageSize
    const items = await query(
      'SELECT * FROM mensajes ORDER BY recibido_en DESC LIMIT ? OFFSET ?',
      [pageSize, offset]
    )
    res.json({ items, total: totalItems, unread: Number(unread), page, pageSize, totalPages })
  } catch (error) { next(error) }
})

router.post('/admin/mensajes/marcar-todos-leidos', async (req, res, next) => {
  try {
    const result = await query('UPDATE mensajes SET leido = 1 WHERE leido = 0')
    return res.json({ message: 'Todos los mensajes fueron marcados como leídos.', updated: result.affectedRows })
  } catch (error) { return next(error) }
})

router.post('/admin/mensajes/eliminar-todos', async (req, res, next) => {
  try {
    const result = await query('DELETE FROM mensajes')
    return res.json({ message: 'Todos los mensajes fueron eliminados.', deleted: result.affectedRows })
  } catch (error) { return next(error) }
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
