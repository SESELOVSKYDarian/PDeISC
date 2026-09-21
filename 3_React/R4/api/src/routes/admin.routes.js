import { Router } from 'express'
import { pool, query } from '../services/db.js'
import { requireAuth } from '../middleware/auth.js'
import { cleanText, isEmail, isUrl, toBoolean, toOrder, toPositiveId } from '../utils/validators.js'

const router = Router()
router.use('/admin', requireAuth)

const resources = {
  'categorias-habilidades': {
    table: 'categorias_habilidades',
    fields: ['nombre', 'imagen_url', 'orden'],
    parse: (body) => ({ nombre: cleanText(body.nombre, 80), imagen_url: cleanText(body.imagen_url, 500), orden: toOrder(body.orden) }),
    validate: (data) => data.nombre.length >= 2 && isUrl(data.imagen_url)
  },
  'enlaces-sociales': {
    table: 'enlaces_sociales',
    fields: ['nombre', 'url', 'orden'],
    parse: (body) => ({ nombre: cleanText(body.nombre, 50), url: cleanText(body.url, 500), orden: toOrder(body.orden) }),
    validate: (data) => data.nombre.length >= 2 && isUrl(data.url)
  },
  experiencias: {
    table: 'experiencias',
    fields: ['titulo', 'organizacion', 'periodo', 'descripcion', 'orden'],
    parse: (body) => ({ titulo: cleanText(body.titulo, 120), organizacion: cleanText(body.organizacion, 120), periodo: cleanText(body.periodo, 80), descripcion: cleanText(body.descripcion, 800), orden: toOrder(body.orden) }),
    validate: (data) => data.titulo.length >= 2 && data.organizacion.length >= 2 && data.periodo.length >= 2 && data.descripcion.length >= 10
  },
  logros: {
    table: 'logros',
    fields: ['titulo', 'descripcion', 'fecha', 'orden'],
    parse: (body) => ({ titulo: cleanText(body.titulo, 120), descripcion: cleanText(body.descripcion, 500), fecha: cleanText(body.fecha, 40), orden: toOrder(body.orden) }),
    validate: (data) => data.titulo.length >= 2 && data.descripcion.length >= 5 && data.fecha.length >= 2
  }
}

const resourceHandler = (action) => async (req, res, next) => {
  try {
    const resource = resources[req.params.recurso]
    if (!resource) return next()
    if (action === 'listar') {
      const items = await query(`SELECT * FROM ${resource.table} ORDER BY orden, id`)
      return res.json({ items })
    }
    const id = toPositiveId(req.body.id)
    if (action === 'eliminar') {
      if (!id) return res.status(422).json({ message: 'Identificador inválido.' })
      await query(`DELETE FROM ${resource.table} WHERE id = ?`, [id])
      return res.json({ message: 'Registro eliminado.' })
    }
    const data = resource.parse(req.body)
    if (!resource.validate(data)) return res.status(422).json({ message: 'Revisá los datos ingresados.' })
    const values = resource.fields.map((field) => data[field])
    if (action === 'crear') {
      const placeholders = resource.fields.map(() => '?').join(', ')
      const result = await query(`INSERT INTO ${resource.table} (${resource.fields.join(', ')}) VALUES (${placeholders})`, values)
      return res.status(201).json({ message: 'Registro creado.', id: result.insertId })
    }
    if (!id) return res.status(422).json({ message: 'Identificador inválido.' })
    const setters = resource.fields.map((field) => `${field} = ?`).join(', ')
    await query(`UPDATE ${resource.table} SET ${setters} WHERE id = ?`, [...values, id])
    return res.json({ message: 'Registro actualizado.' })
  } catch (error) {
    return next(error)
  }
}

for (const action of ['listar', 'crear', 'actualizar', 'eliminar']) {
  router.post(`/admin/:recurso/${action}`, resourceHandler(action))
}

router.post('/admin/habilidades/listar', async (req, res, next) => {
  try {
    const items = await query(`SELECT h.*, c.nombre AS categoria FROM habilidades h
      INNER JOIN categorias_habilidades c ON c.id = h.categoria_id ORDER BY c.orden, h.orden, h.id`)
    res.json({ items })
  } catch (error) { next(error) }
})

for (const action of ['crear', 'actualizar']) {
  router.post(`/admin/habilidades/${action}`, async (req, res, next) => {
    try {
      const data = {
        nombre: cleanText(req.body.nombre, 80),
        categoria_id: toPositiveId(req.body.categoria_id),
        nivel: Math.min(100, Math.max(1, Number(req.body.nivel) || 1)),
        orden: toOrder(req.body.orden)
      }
      if (data.nombre.length < 2 || !data.categoria_id) return res.status(422).json({ message: 'Revisá la habilidad y su categoría.' })
      if (action === 'crear') {
        const result = await query('INSERT INTO habilidades (nombre, categoria_id, nivel, orden) VALUES (?, ?, ?, ?)', [data.nombre, data.categoria_id, data.nivel, data.orden])
        return res.status(201).json({ message: 'Habilidad creada.', id: result.insertId })
      }
      const id = toPositiveId(req.body.id)
      if (!id) return res.status(422).json({ message: 'Identificador inválido.' })
      await query('UPDATE habilidades SET nombre = ?, categoria_id = ?, nivel = ?, orden = ? WHERE id = ?', [data.nombre, data.categoria_id, data.nivel, data.orden, id])
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

router.post('/admin/perfil/listar', async (req, res, next) => {
  try {
    const [item] = await query('SELECT * FROM perfil WHERE id = 1')
    res.json({ item })
  } catch (error) { next(error) }
})

router.post('/admin/perfil/actualizar', async (req, res, next) => {
  const fields = ['nombre', 'rol', 'saludo', 'presentacion', 'descripcion', 'ubicacion', 'email', 'disponibilidad', 'retrato_url', 'cv_url']
  try {
    const data = {
      nombre: cleanText(req.body.nombre, 80), rol: cleanText(req.body.rol, 120), saludo: cleanText(req.body.saludo, 120),
      presentacion: cleanText(req.body.presentacion, 500), descripcion: cleanText(req.body.descripcion, 4000), ubicacion: cleanText(req.body.ubicacion, 120),
      email: cleanText(req.body.email, 160), disponibilidad: cleanText(req.body.disponibilidad, 120), retrato_url: cleanText(req.body.retrato_url, 500),
      cv_url: cleanText(req.body.cv_url, 500)
    }
    if (data.nombre.length < 2 || data.rol.length < 2 || data.presentacion.length < 10 || !isEmail(data.email) || !isUrl(data.retrato_url) || !isUrl(data.cv_url)) {
      return res.status(422).json({ message: 'Revisá los datos del perfil.' })
    }
    await query(`UPDATE perfil SET ${fields.map((field) => `${field} = ?`).join(', ')} WHERE id = 1`, fields.map((field) => data[field]))
    return res.json({ message: 'Perfil actualizado.' })
  } catch (error) { return next(error) }
})

const parseProject = (body) => ({
  titulo: cleanText(body.titulo, 120), resumen: cleanText(body.resumen, 240), descripcion: cleanText(body.descripcion, 1200),
  imagen_url: cleanText(body.imagen_url, 500), demo_url: cleanText(body.demo_url, 500), repo_url: cleanText(body.repo_url, 500),
  destacado: toBoolean(body.destacado), orden: toOrder(body.orden),
  tecnologias: [...new Set((Array.isArray(body.tecnologias) ? body.tecnologias : String(body.tecnologias || '').split(',')).map((item) => cleanText(item, 80)).filter(Boolean))].slice(0, 12)
})

const saveTechnologies = async (connection, projectId, technologies) => {
  await connection.execute('DELETE FROM proyecto_tecnologias WHERE proyecto_id = ?', [projectId])
  for (const name of technologies) {
    await connection.execute('INSERT INTO tecnologias (nombre) VALUES (?) ON DUPLICATE KEY UPDATE nombre = nombre', [name])
    const [[technology]] = await connection.execute('SELECT id FROM tecnologias WHERE nombre = ?', [name])
    await connection.execute('INSERT INTO proyecto_tecnologias (proyecto_id, tecnologia_id) VALUES (?, ?)', [projectId, technology.id])
  }
}

router.post('/admin/proyectos/listar', async (req, res, next) => {
  try {
    const items = await query(`SELECT p.*, GROUP_CONCAT(t.nombre ORDER BY t.nombre SEPARATOR ', ') AS tecnologias
      FROM proyectos p LEFT JOIN proyecto_tecnologias pt ON pt.proyecto_id = p.id
      LEFT JOIN tecnologias t ON t.id = pt.tecnologia_id GROUP BY p.id ORDER BY p.orden, p.id`)
    res.json({ items: items.map((item) => ({ ...item, destacado: Boolean(item.destacado) })) })
  } catch (error) { next(error) }
})

for (const action of ['crear', 'actualizar']) {
  router.post(`/admin/proyectos/${action}`, async (req, res, next) => {
    const data = parseProject(req.body)
    if (data.titulo.length < 2 || data.resumen.length < 5 || data.descripcion.length < 10 || !isUrl(data.imagen_url) || !isUrl(data.demo_url) || !isUrl(data.repo_url)) {
      return res.status(422).json({ message: 'Revisá los datos del proyecto.' })
    }
    const connection = await pool.getConnection()
    try {
      await connection.beginTransaction()
      let projectId = toPositiveId(req.body.id)
      const values = [data.titulo, data.resumen, data.descripcion, data.imagen_url, data.demo_url || null, data.repo_url || null, data.destacado, data.orden]
      if (action === 'crear') {
        const [result] = await connection.execute(`INSERT INTO proyectos (titulo, resumen, descripcion, imagen_url, demo_url, repo_url, destacado, orden) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, values)
        projectId = result.insertId
      } else {
        if (!projectId) throw Object.assign(new Error('Identificador inválido.'), { status: 422 })
        await connection.execute(`UPDATE proyectos SET titulo=?, resumen=?, descripcion=?, imagen_url=?, demo_url=?, repo_url=?, destacado=?, orden=? WHERE id=?`, [...values, projectId])
      }
      await saveTechnologies(connection, projectId, data.tecnologias)
      await connection.commit()
      res.status(action === 'crear' ? 201 : 200).json({ message: `Proyecto ${action === 'crear' ? 'creado' : 'actualizado'}.`, id: projectId })
    } catch (error) {
      await connection.rollback()
      next(error)
    } finally { connection.release() }
  })
}

router.post('/admin/proyectos/eliminar', async (req, res, next) => {
  try {
    const id = toPositiveId(req.body.id)
    if (!id) return res.status(422).json({ message: 'Identificador inválido.' })
    await query('DELETE FROM proyectos WHERE id = ?', [id])
    return res.json({ message: 'Proyecto eliminado.' })
  } catch (error) { return next(error) }
})

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
