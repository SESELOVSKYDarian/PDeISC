import { pool } from "../db.js";
import { findById } from "./findUser.js";

export async function createUser({ nombre, email, passwordHash = null, rol = "usuario" }) {
  const sql = "INSERT INTO usuarios (nombre, email, password_hash, rol_id) VALUES (?, ?, ?, (SELECT id FROM roles WHERE nombre = ?))";
  const [result] = await pool.execute(sql, [nombre.trim(), email, passwordHash, rol]);
  return findById(result.insertId);
}
