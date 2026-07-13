// pool de conexiones a MySQL, lo uso en todos los modelos
import mysql from 'mysql2/promise';
import { ENV } from './environment.js';

export const pool = mysql.createPool({
  host: ENV.DB_HOST,
  port: ENV.DB_PORT,
  user: ENV.DB_USER,
  password: ENV.DB_PASSWORD,
  database: ENV.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  dateStrings: true
});

// pequeña funcion para chequear que la base responde al arrancar el server
export async function verificarConexion() {
  try {
    const conexion = await pool.getConnection();
    await conexion.ping();
    conexion.release();
    console.log('✔ Conexion a MySQL establecida correctamente');
    return true;
  } catch (error) {
    console.error('✘ No se pudo conectar a MySQL:', error.message);
    return false;
  }
}
