import { pool } from "../db.js";
import { fromUsers, publicColumns } from "./userSql.js";

// usuario que ya entró antes con esa red (o undefined)
export async function findByIdentity(provider, providerUid) {
  const sql = `SELECT ${publicColumns} ${fromUsers} JOIN identidades_oauth i ON i.usuario_id = u.id WHERE i.proveedor = ? AND i.proveedor_uid = ?`;
  const [rows] = await pool.execute(sql, [provider, providerUid]);
  return rows[0];
}

export async function linkIdentity(userId, provider, providerUid) {
  await pool.execute("INSERT INTO identidades_oauth (usuario_id, proveedor, proveedor_uid) VALUES (?, ?, ?)", [userId, provider, providerUid]);
}
