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

export const query = async (sql, params = []) => {
  const [rows] = await pool.execute(sql, params)
  return rows
}
