import { pool } from "../db.js";

export async function removeUser(id) {
  await pool.execute("DELETE FROM usuarios WHERE id = ?", [id]);
}
