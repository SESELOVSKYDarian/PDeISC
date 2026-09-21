import { Router } from 'express'
import { pool, query } from '../../services/db.js'
import { nextOrder } from '../../services/order.js'
import { cleanText, isUrl, toBoolean, toPositiveId } from '../../utils/validators.js'

const router = Router()

const parseProject = (body) => ({
  titulo: cleanText(body.titulo, 120),
  resumen: cleanText(body.resumen, 240),
  descripcion: cleanText(body.descripcion, 1200),
  imagen_url: cleanText(body.imagen_url, 500),
  demo_url: cleanText(body.demo_url, 500),
  repo_url: cleanText(body.repo_url, 500),
  destacado: toBoolean(body.destacado),
  tecnologias: [...new Set((Array.isArray(body.tecnologias) ? body.tecnologias : String(body.tecnologias || '').split(',')).map((item) => cleanText(item, 80)).filter(Boolean))].slice(0, 12)
})

// la imagen es obligatoria; la demo y el repositorio son opcionales
const isValidProject = (data) => data.titulo.length >= 2 && data.resumen.length >= 5 && data.descripcion.length >= 10
  && Boolean(data.imagen_url) && isUrl(data.imagen_url) && isUrl(data.demo_url) && isUrl(data.repo_url)

// reemplaza las tecnologías del proyecto (relación muchos a muchos)
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
    if (!isValidProject(data)) return res.status(422).json({ message: 'Revisá los datos del proyecto.' })

    const connection = await pool.getConnection()
    try {
      await connection.beginTransaction()
      let projectId = toPositiveId(req.body.id)
      const values = [data.titulo, data.resumen, data.descripcion, data.imagen_url, data.demo_url || null, data.repo_url || null, data.destacado]
      if (action === 'crear') {
        const [result] = await connection.execute('INSERT INTO proyectos (titulo, resumen, descripcion, imagen_url, demo_url, repo_url, destacado, orden) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [...values, await nextOrder('proyectos')])
        projectId = result.insertId
      } else {
        if (!projectId) throw Object.assign(new Error('Identificador inválido.'), { status: 422 })
        await connection.execute('UPDATE proyectos SET titulo=?, resumen=?, descripcion=?, imagen_url=?, demo_url=?, repo_url=?, destacado=? WHERE id=?', [...values, projectId])
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

export default router
