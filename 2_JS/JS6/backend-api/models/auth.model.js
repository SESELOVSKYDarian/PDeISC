// concentra las consultas de códigos y sesiones para mantener el service independiente de mysql
import { pool } from '../config/database.js';

export const AuthModel = {
  async guardarCodigo(email, codigoHash, fechaExpiracion) {
    await pool.query('UPDATE auth_codigos SET usado = 1 WHERE email = ? AND usado = 0', [email]);
    await pool.query(
      'INSERT INTO auth_codigos (email, codigo_hash, fecha_expiracion) VALUES (?, ?, ?)',
      [email, codigoHash, fechaExpiracion]
    );
  },

  async obtenerCodigoVigente(email) {
    const [filas] = await pool.query(
      'SELECT id, codigo_hash, fecha_expiracion FROM auth_codigos WHERE email = ? AND usado = 0 ORDER BY id DESC LIMIT 1',
      [email]
    );
    return filas[0] || null;
  },

  async marcarCodigoUsado(id) {
    await pool.query('UPDATE auth_codigos SET usado = 1 WHERE id = ?', [id]);
  },

  async crearSesion(tokenHash, email, fechaExpiracion) {
    await pool.query('DELETE FROM auth_sesiones WHERE email = ? OR fecha_expiracion < NOW()', [email]);
    await pool.query(
      'INSERT INTO auth_sesiones (token_hash, email, fecha_expiracion) VALUES (?, ?, ?)',
      [tokenHash, email, fechaExpiracion]
    );
  },

  async obtenerSesion(tokenHash) {
    const [filas] = await pool.query(
      'SELECT email, fecha_expiracion FROM auth_sesiones WHERE token_hash = ? AND fecha_expiracion > NOW() LIMIT 1',
      [tokenHash]
    );
    return filas[0] || null;
  },

  async eliminarSesion(tokenHash) {
    await pool.query('DELETE FROM auth_sesiones WHERE token_hash = ?', [tokenHash]);
  }
};
