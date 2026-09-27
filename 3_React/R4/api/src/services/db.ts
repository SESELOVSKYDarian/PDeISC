import mysql from 'mysql2/promise'
import { config } from '../config.js'

export const pool = mysql.createPool({
  host: config.database.host,
  port: config.database.port,
  user: config.database.user,
  password: config.database.password,
  database: config.database.name,
  waitForConnections: true,
  connectionLimit: 10,
  decimalNumbers: true,
  timezone: 'Z'
})

export const query = async <T = any>(sql: string, params: any[] = []): Promise<T> => {
  const [rows] = await pool.execute(sql, params)
  return rows as T
}
