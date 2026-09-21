import { pool } from "../db.js";
import { fromUsers, publicColumns } from "./userSql.js";

// incluye password_hash: solo para usar en el login
export async function findByEmail(email) {
  const sql = `SELECT ${publicColumns}, u.password_hash ${fromUsers} WHERE u.email = ?`;
  const [rows] = await pool.execute(sql, [email]);
  return rows[0];
}

export async function findById(id) {
  const [rows] = await pool.execute(`SELECT ${publicColumns} ${fromUsers} WHERE u.id = ?`, [id]);
  return rows[0];
}
