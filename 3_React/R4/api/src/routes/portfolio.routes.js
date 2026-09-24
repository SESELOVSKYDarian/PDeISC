import { Router } from 'express'
import { ipKeyGenerator, rateLimit } from 'express-rate-limit'
import { query } from '../services/db.js'
import { validateContact } from '../utils/validators.js'

const router = Router()

// Evita ráfagas desde un mismo navegador/red aunque cambien el correo ingresado.
const contactIpLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 8,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Se alcanzó el límite de envíos. Intentá nuevamente más tarde.' }
})

// Un mismo correo no puede enviar más de un mensaje por minuto.
const contactEmailLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 1,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    const email = String(req.body?.email || '').trim().toLowerCase()
    return email || ipKeyGenerator(req.ip)
  },
  message: { message: 'Ese correo ya envió un mensaje recientemente. Esperá un minuto.' }
})

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

router.post('/contacto/crear', contactIpLimiter, contactEmailLimiter, async (req, res, next) => {
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
