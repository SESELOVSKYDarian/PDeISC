import fs from 'node:fs/promises'
import path from 'node:path'
import mysql from 'mysql2/promise'
import { fileURLToPath } from 'node:url'
import { config } from '../src/config.js'

const here = path.dirname(fileURLToPath(import.meta.url))
const connection = await mysql.createConnection({
  host: config.database.host,
  port: config.database.port,
  user: config.database.user,
  password: config.database.password,
  multipleStatements: true
})

try {
  const safeName = config.database.name.replace(/[^a-zA-Z0-9_]/g, '')
  await connection.query(`CREATE DATABASE IF NOT EXISTS \`${safeName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`)
  await connection.query(`USE \`${safeName}\``)
  const schema = await fs.readFile(path.join(here, 'schema.sql'), 'utf8')
  await connection.query(schema)
  const [legacyColumns] = await connection.execute(`SELECT COLUMN_NAME FROM information_schema.COLUMNS
    WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'habilidades' AND COLUMN_NAME = 'categoria'`, [safeName])
  if (legacyColumns.length) {
    const [categoryIdColumns] = await connection.execute(`SELECT COLUMN_NAME FROM information_schema.COLUMNS
      WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'habilidades' AND COLUMN_NAME = 'categoria_id'`, [safeName])
    if (!categoryIdColumns.length) await connection.query('ALTER TABLE habilidades ADD COLUMN categoria_id INT UNSIGNED NULL AFTER nombre')
    await connection.query(`INSERT IGNORE INTO categorias_habilidades (nombre, imagen_url, orden)
      SELECT DISTINCT categoria,
        CASE categoria
          WHEN 'Frontend' THEN '/project-portfolio.svg'
          WHEN 'Backend' THEN '/project-users.svg'
          WHEN 'Datos' THEN '/project-tasks.svg'
          WHEN 'Diseño' THEN '/project-portfolio.svg'
          ELSE '/project-users.svg'
        END,
        CASE categoria WHEN 'Frontend' THEN 1 WHEN 'Backend' THEN 2 WHEN 'Datos' THEN 3 WHEN 'Diseño' THEN 4 ELSE 5 END
      FROM habilidades`)
    await connection.query(`UPDATE habilidades h INNER JOIN categorias_habilidades c ON c.nombre = h.categoria
      SET h.categoria_id = c.id WHERE h.categoria_id IS NULL`)
    await connection.query('ALTER TABLE habilidades MODIFY categoria_id INT UNSIGNED NOT NULL')
    const [foreignKeys] = await connection.execute(`SELECT CONSTRAINT_NAME FROM information_schema.TABLE_CONSTRAINTS
      WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'habilidades' AND CONSTRAINT_NAME = 'fk_habilidad_categoria'`, [safeName])
    if (!foreignKeys.length) await connection.query('ALTER TABLE habilidades ADD CONSTRAINT fk_habilidad_categoria FOREIGN KEY (categoria_id) REFERENCES categorias_habilidades(id) ON DELETE RESTRICT')
    await connection.query('ALTER TABLE habilidades DROP COLUMN categoria')
  }
  // bases viejas: quito las estadísticas que ya no se usan
  for (const column of ['anos_experiencia', 'proyectos_completados', 'clientes_satisfechos']) {
    const [found] = await connection.execute(`SELECT COLUMN_NAME FROM information_schema.COLUMNS
      WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'perfil' AND COLUMN_NAME = ?`, [safeName, column])
    if (found.length) await connection.query(`ALTER TABLE perfil DROP COLUMN \`${column}\``)
  }
  // bases viejas: agrego la columna del favicon
  const [faviconColumn] = await connection.execute(`SELECT COLUMN_NAME FROM information_schema.COLUMNS
    WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'perfil' AND COLUMN_NAME = 'favicon_url'`, [safeName])
  if (!faviconColumn.length) await connection.query('ALTER TABLE perfil ADD COLUMN favicon_url VARCHAR(500) NULL AFTER cv_url')
  console.log(`Base ${safeName} inicializada.`)
} finally {
  await connection.end()
}
