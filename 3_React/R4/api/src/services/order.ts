import { pool, query } from './db.js'

// tablas cuyo orden se puede cambiar arrastrando (lista blanca: el nombre nunca viene del cliente)
export const orderTables: Record<string, string> = {
  'categorias-habilidades': 'categorias_habilidades',
  habilidades: 'habilidades',
  proyectos: 'proyectos',
  experiencias: 'experiencias',
  logros: 'logros',
  'enlaces-sociales': 'enlaces_sociales'
}

// los registros nuevos van al final de la lista
export async function nextOrder(table: string): Promise<number> {
  const [row] = await query<Array<{ siguiente: number }>>(`SELECT COALESCE(MAX(orden), 0) + 1 AS siguiente FROM ${table}`)
  return row.siguiente
}

// guarda el orden recibido: el primer id queda en 1, el segundo en 2, etc.
export async function saveOrder(table: string, ids: number[]): Promise<void> {
  const connection = await pool.getConnection()
  try {
    await connection.beginTransaction()
    for (const [index, id] of ids.entries()) {
      await connection.execute(`UPDATE ${table} SET orden = ? WHERE id = ?`, [index + 1, id])
    }
    await connection.commit()
  } catch (error) {
    await connection.rollback()
    throw error
  } finally { connection.release() }
}
