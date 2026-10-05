import { pool } from "../db.js";

const COLUMNAS = `u.id, u.nombre, u.email, u.password_hash, r.nombre AS rol`;

// busca por email (consulta parametrizada)
export async function buscarPorEmail(email) {
  const [filas] = await pool.query(
    `SELECT ${COLUMNAS} FROM usuarios u JOIN roles r ON r.id = u.rol_id WHERE u.email = ? LIMIT 1`,
    [email]
  );
  return filas[0] ?? null;
}

// busca por la identidad de una red social
export async function buscarPorIdentidad(proveedor, uid) {
  const [filas] = await pool.query(
    `SELECT ${COLUMNAS} FROM identidades i
     JOIN proveedores p ON p.id = i.proveedor_id
     JOIN usuarios u ON u.id = i.usuario_id
     JOIN roles r ON r.id = u.rol_id
     WHERE p.nombre = ? AND i.proveedor_uid = ? LIMIT 1`,
    [proveedor, uid]
  );
  return filas[0] ?? null;
}

// rol "usuario" por defecto; passwordHash es null si viene de una red social
export async function crearUsuario({ nombre, email, passwordHash = null }) {
  const [res] = await pool.query(
    `INSERT INTO usuarios (nombre, email, password_hash, rol_id)
     VALUES (?, ?, ?, (SELECT id FROM roles WHERE nombre = 'usuario'))`,
    [nombre.slice(0, 80), email, passwordHash]
  );
  return res.insertId;
}

export async function vincularIdentidad(usuarioId, proveedor, uid) {
  await pool.query(
    `INSERT IGNORE INTO identidades (usuario_id, proveedor_id, proveedor_uid)
     VALUES (?, (SELECT id FROM proveedores WHERE nombre = ?), ?)`,
    [usuarioId, proveedor, uid]
  );
}

// lo único que sale hacia el cliente: nunca el hash
export function publico(usuario) {
  return { id: usuario.id, nombre: usuario.nombre, email: usuario.email, rol: usuario.rol };
}
