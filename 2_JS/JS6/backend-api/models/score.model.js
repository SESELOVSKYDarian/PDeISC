// esta es la única capa que habla directo con la tabla "score"
import { pool } from '../config/database.js';

export const ScoreModel = {
  async listar({ orden = 'puntos', direccion = 'DESC', busqueda, pagina = 1, porPagina = 10 } = {}) {
    const columnasValidas = ['puntos', 'tiempo', 'fecha', 'nombre'];
    const columna = columnasValidas.includes(orden) ? orden : 'puntos';
    const dir = direccion.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    let sql = 'SELECT id, nombre, tiempo, puntos, fecha FROM score WHERE 1=1';
    const params = [];

    if (busqueda) {
      sql += ' AND nombre LIKE ?';
      params.push(`%${busqueda}%`);
    }

    sql += ` ORDER BY ${columna} ${dir}`;

    const offset = (Math.max(1, pagina) - 1) * porPagina;
    sql += ' LIMIT ? OFFSET ?';
    params.push(Number(porPagina), Number(offset));

    const [filas] = await pool.query(sql, params);

    // cuento el total para poder armar la paginacion en el frontend
    let sqlTotal = 'SELECT COUNT(*) AS total FROM score WHERE 1=1';
    const paramsTotal = [];
    if (busqueda) {
      sqlTotal += ' AND nombre LIKE ?';
      paramsTotal.push(`%${busqueda}%`);
    }
    const [totales] = await pool.query(sqlTotal, paramsTotal);

    return { filas, total: totales[0].total };
  },

  async listarTodosOrdenados() {
    const [filas] = await pool.query('SELECT id, nombre, tiempo, puntos, fecha FROM score ORDER BY puntos DESC, tiempo ASC');
    return filas;
  },

  async crear({ nombre, tiempo, puntos }) {
    const [resultado] = await pool.query(
      'INSERT INTO score (nombre, tiempo, puntos) VALUES (?, ?, ?)',
      [nombre, tiempo, puntos]
    );
    return resultado.insertId;
  },

  async actualizar(id, { nombre, tiempo, puntos }) {
    const [resultado] = await pool.query(
      'UPDATE score SET nombre = ?, tiempo = ?, puntos = ? WHERE id = ?',
      [nombre, tiempo, puntos, id]
    );
    return resultado.affectedRows > 0;
  },

  async eliminar(id) {
    const [resultado] = await pool.query('DELETE FROM score WHERE id = ?', [id]);
    return resultado.affectedRows > 0;
  },

  async obtenerPorId(id) {
    const [filas] = await pool.query('SELECT id, nombre, tiempo, puntos, fecha FROM score WHERE id = ?', [id]);
    return filas[0] || null;
  },

  async contarTotal() {
    const [filas] = await pool.query('SELECT COUNT(*) AS total FROM score');
    return filas[0].total;
  },

  async promedioPuntos() {
    const [filas] = await pool.query('SELECT AVG(puntos) AS promedio FROM score');
    return filas[0].promedio || 0;
  },

  async mejorPuntaje() {
    const [filas] = await pool.query('SELECT nombre, puntos FROM score ORDER BY puntos DESC LIMIT 1');
    return filas[0] || null;
  }
};
