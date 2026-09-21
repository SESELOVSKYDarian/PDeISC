import { Router } from 'express'
import { query } from '../services/db.js'
import { validateContact } from '../utils/validators.js'

const router = Router()

router.post('/portfolio/obtener', async (req, res, next) => {
  try {
    const [profileRows, socialLinks, categories, skills, experiences, achievements, projects, technologyRows] = await Promise.all([
      query('SELECT * FROM perfil WHERE id = 1'),
      query('SELECT * FROM enlaces_sociales ORDER BY orden, id'),
      query('SELECT * FROM categorias_habilidades ORDER BY orden, id'),
      query(`SELECT h.*, c.nombre AS categoria FROM habilidades h
        INNER JOIN categorias_habilidades c ON c.id = h.categoria_id ORDER BY c.orden, h.orden, h.id`),
      query('SELECT * FROM experiencias ORDER BY orden, id'),
      query('SELECT * FROM logros ORDER BY orden, id'),
      query('SELECT * FROM proyectos ORDER BY orden, id'),
      query(`SELECT pt.proyecto_id, t.nombre FROM proyecto_tecnologias pt
        INNER JOIN tecnologias t ON t.id = pt.tecnologia_id ORDER BY t.nombre`)
    ])
    const technologiesByProject = technologyRows.reduce((result, item) => {
      result[item.proyecto_id] ||= []
      result[item.proyecto_id].push(item.nombre)
      return result
    }, {})
    res.json({
      profile: profileRows[0] || null,
      socialLinks,
      skills,
      skillCategories: categories.map((category) => ({
        ...category,
        habilidades: skills.filter((skill) => skill.categoria_id === category.id)
      })),
      experiences,
      achievements,
      projects: projects.map((project) => ({
        ...project,
        destacado: Boolean(project.destacado),
        tecnologias: technologiesByProject[project.id] || []
      }))
    })
  } catch (error) {
    next(error)
  }
})

router.post('/contacto/crear', async (req, res, next) => {
  try {
    const { data, errors } = validateContact(req.body)
    if (Object.keys(errors).length) return res.status(422).json({ message: 'Revisá los campos.', errors })
    await query('INSERT INTO mensajes (nombre, email, asunto, mensaje) VALUES (?, ?, ?, ?)',
      [data.nombre, data.email, data.asunto, data.mensaje])
    return res.status(201).json({ message: 'Mensaje enviado. Gracias por escribir.' })
  } catch (error) {
    return next(error)
  }
})

export default router
