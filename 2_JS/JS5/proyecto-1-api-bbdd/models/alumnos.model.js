import { pool } from "../config/db.js";

export async function obtenerAlumnos() {
  const [filas] = await pool.query(
    "SELECT id, nombre, apellido, edad FROM alumnos ORDER BY id ASC"
  );

  return filas;
}

export async function obtenerAlumnoPorId(id) {
  const [filas] = await pool.query(
    "SELECT id, nombre, apellido, edad FROM alumnos WHERE id = ?",
    [id]
  );

  return filas[0] || null;
}

export async function crearAlumno({ nombre, apellido, edad }) {
  const [resultado] = await pool.query(
    "INSERT INTO alumnos (nombre, apellido, edad) VALUES (?, ?, ?)",
    [nombre.trim(), apellido.trim(), Number(edad)]
  );

  return resultado.insertId;
}

export async function actualizarAlumno(id, { nombre, apellido, edad }) {
  const [resultado] = await pool.query(
    "UPDATE alumnos SET nombre = ?, apellido = ?, edad = ? WHERE id = ?",
    [nombre.trim(), apellido.trim(), Number(edad), Number(id)]
  );

  return resultado.affectedRows;
}

export async function eliminarAlumno(id) {
  const [resultado] = await pool.query(
    "DELETE FROM alumnos WHERE id = ?",
    [Number(id)]
  );

  return resultado.affectedRows;
}

