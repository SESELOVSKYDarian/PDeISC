import { Router } from 'express'
import { query } from '../../services/db.js'
import { nextOrder } from '../../services/order.js'
import { cleanText, toPositiveId } from '../../utils/validators.js'

const router = Router()

router.post('/admin/habilidades/listar', async (req, res, next) => {
  try {
    const items = await query(`SELECT h.*, c.nombre AS categoria FROM habilidades h
      INNER JOIN categorias_habilidades c ON c.id = h.categoria_id ORDER BY c.orden, h.orden, h.id`)
    res.json({ items })
  } catch (error) { next(error) }
})

const parseSkill = (body) => ({
  nombre: cleanText(body.nombre, 80),
  categoria_id: toPositiveId(body.categoria_id),
  nivel: Math.min(100, Math.max(1, Number(body.nivel) || 1))
})

for (const action of ['crear', 'actualizar']) {
  router.post(`/admin/habilidades/${action}`, async (req, res, next) => {
    try {
      const data = parseSkill(req.body)
      if (data.nombre.length < 2 || !data.categoria_id) return res.status(422).json({ message: 'Revisá la habilidad y su categoría.' })
      if (action === 'crear') {
        const result = await query('INSERT INTO habilidades (nombre, categoria_id, nivel, orden) VALUES (?, ?, ?, ?)', [data.nombre, data.categoria_id, data.nivel, await nextOrder('habilidades')])
        return res.status(201).json({ message: 'Habilidad creada.', id: result.insertId })
      }
      const id = toPositiveId(req.body.id)
      if (!id) return res.status(422).json({ message: 'Identificador inválido.' })
      await query('UPDATE habilidades SET nombre = ?, categoria_id = ?, nivel = ? WHERE id = ?', [data.nombre, data.categoria_id, data.nivel, id])
      return res.json({ message: 'Habilidad actualizada.' })
    } catch (error) { return next(error) }
  })
}

router.post('/admin/habilidades/eliminar', async (req, res, next) => {
  try {
    const id = toPositiveId(req.body.id)
    if (!id) return res.status(422).json({ message: 'Identificador inválido.' })
    await query('DELETE FROM habilidades WHERE id = ?', [id])
    return res.json({ message: 'Habilidad eliminada.' })
  } catch (error) { return next(error) }
})

export default router
