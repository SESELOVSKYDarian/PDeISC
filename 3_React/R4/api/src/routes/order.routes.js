import { Router } from 'express'
import { requireAuth } from '../middleware/auth.js'
import { orderTables, saveOrder } from '../services/order.js'
import { toPositiveId } from '../utils/validators.js'

const router = Router()

// recibe los ids en el orden nuevo (por ejemplo, después de arrastrar una fila)
router.post('/admin/:recurso/ordenar', requireAuth, async (req, res, next) => {
  try {
    const table = Object.hasOwn(orderTables, req.params.recurso) ? orderTables[req.params.recurso] : null
    if (!table) return res.status(404).json({ message: 'Ese contenido no se puede ordenar.' })

    const ids = Array.isArray(req.body.ids) ? req.body.ids.map(toPositiveId) : []
    if (!ids.length || ids.length > 500 || ids.some((id) => !id) || new Set(ids).size !== ids.length) {
      return res.status(422).json({ message: 'La lista de orden no es válida.' })
    }
    await saveOrder(table, ids)
    return res.json({ message: 'Orden actualizado.' })
  } catch (error) { return next(error) }
})

export default router
