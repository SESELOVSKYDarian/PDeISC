import bcrypt from 'bcryptjs'
import { config } from '../src/config.js'
import { pool, query } from '../src/services/db.js'
import { achievements, categories, experiences, profile, projects, skills, socialLinks } from './seedData.js'

const seedAdmin = async () => {
  const passwordHash = await bcrypt.hash(config.admin.password, 12)
  await query(`INSERT INTO administradores (nombre, email, password_hash)
    VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE nombre = VALUES(nombre), password_hash = VALUES(password_hash)`,
  [config.admin.name, config.admin.email.toLowerCase(), passwordHash])
}

const seedProfile = () => query(`INSERT INTO perfil
  (id, nombre, rol, saludo, presentacion, descripcion, ubicacion, email, disponibilidad, retrato_url, cv_url)
  VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  ON DUPLICATE KEY UPDATE id = id`,
[profile.nombre, profile.rol, profile.saludo, profile.presentacion, profile.descripcion, profile.ubicacion,
  profile.email, profile.disponibilidad, profile.retrato_url, profile.cv_url])

const seedSkills = async () => {
  for (const [index, category] of categories.entries()) {
    await query('INSERT INTO categorias_habilidades (nombre, imagen_url, orden) VALUES (?, ?, ?)', [category.nombre, category.imagen_url, index + 1])
  }
  for (const [index, skill] of skills.entries()) {
    await query(`INSERT INTO habilidades (nombre, categoria_id, nivel, orden)
      VALUES (?, (SELECT id FROM categorias_habilidades WHERE nombre = ?), ?, ?)`, [skill.nombre, skill.categoria, skill.nivel, index + 1])
  }
}

const seedProjects = async () => {
  for (const [index, project] of projects.entries()) {
    const result = await query(`INSERT INTO proyectos (titulo, resumen, descripcion, imagen_url, demo_url, repo_url, destacado, orden)
      VALUES (?, ?, ?, ?, ?, ?, TRUE, ?)`,
    [project.titulo, project.resumen, project.descripcion, project.imagen_url, project.demo_url || null, project.repo_url || null, index + 1])
    for (const name of project.tecnologias) {
      await query('INSERT INTO tecnologias (nombre) VALUES (?) ON DUPLICATE KEY UPDATE nombre = nombre', [name])
      const [technology] = await query('SELECT id FROM tecnologias WHERE nombre = ?', [name])
      await query('INSERT IGNORE INTO proyecto_tecnologias (proyecto_id, tecnologia_id) VALUES (?, ?)', [result.insertId, technology.id])
    }
  }
}

const seedExperiences = async () => {
  for (const [index, item] of experiences.entries()) {
    await query('INSERT INTO experiencias (titulo, organizacion, periodo, descripcion, orden) VALUES (?, ?, ?, ?, ?)',
      [item.titulo, item.organizacion, item.periodo, item.descripcion, index + 1])
  }
}

const seedAchievements = async () => {
  for (const [index, item] of achievements.entries()) {
    await query('INSERT INTO logros (titulo, descripcion, fecha, orden) VALUES (?, ?, ?, ?)', [item.titulo, item.descripcion, item.fecha, index + 1])
  }
}

const seedLinks = async () => {
  for (const [index, link] of socialLinks.entries()) {
    await query('INSERT INTO enlaces_sociales (nombre, url, orden) VALUES (?, ?, ?)', [link.nombre, link.url, index + 1])
  }
}

// el contenido solo se carga si la base está vacía, para no pisar lo editado en el panel
const seed = async () => {
  await seedAdmin()
  await seedProfile()
  const [{ total }] = await query('SELECT COUNT(*) AS total FROM proyectos')
  if (total === 0) {
    await seedSkills()
    await seedProjects()
    await seedExperiences()
    await seedAchievements()
    await seedLinks()
  }
  console.log('Datos iniciales y administrador listos.')
}

try {
  await seed()
} finally {
  await pool.end()
}
