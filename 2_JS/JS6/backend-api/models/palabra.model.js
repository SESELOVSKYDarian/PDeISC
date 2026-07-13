// esta es la única capa que habla directo con la tabla "palabras"
import { pool } from '../config/database.js';

export const PalabraModel = {
  async obtenerCategorias() {
    const [filas] = await pool.query('SELECT DISTINCT categoria FROM palabras ORDER BY categoria ASC');
    return filas.map(fila => fila.categoria);
  },

  // trae todas las palabras, con filtros opcionales de categoria y dificultad
  async listar({ categoria, dificultad, busqueda } = {}) {
    let sql = 'SELECT id, palabra, categoria, pista, dificultad, fecha_creacion FROM palabras WHERE 1=1';
    const params = [];

    if (categoria) {
      sql += ' AND categoria = ?';
      params.push(categoria);
    }
    if (dificultad) {
      sql += ' AND dificultad = ?';
      params.push(dificultad);
    }
    if (busqueda) {
      sql += ' AND palabra LIKE ?';
      params.push(`%${busqueda}%`);
    }

    sql += ' ORDER BY fecha_creacion DESC';

    const [filas] = await pool.query(sql, params);
    return filas;
  },

  // trae una palabra al azar, con filtro opcional de dificultad
  async aleatoria(dificultad, categorias = []) {
    let sql = 'SELECT id, palabra, categoria, pista, dificultad FROM palabras WHERE 1=1';
    const params = [];

    if (dificultad) {
      sql += ' AND dificultad = ?';
      params.push(dificultad);
    }
    if (Array.isArray(categorias) && categorias.length) {
      sql += ' AND categoria IN (?)';
      params.push(categorias);
    }

    sql += ' ORDER BY RAND() LIMIT 1';

    const [filas] = await pool.query(sql, params);
    return filas[0] || null;
  },

  async existePalabra(palabra) {
    const [filas] = await pool.query('SELECT id FROM palabras WHERE palabra = ? LIMIT 1', [palabra]);
    return filas.length > 0;
  },

  async crear({ palabra, categoria, dificultad, pista }) {
    const [resultado] = await pool.query(
      'INSERT INTO palabras (palabra, categoria, pista, dificultad) VALUES (?, ?, ?, ?)',
      [palabra, categoria, pista?.trim() || null, dificultad || 'media']
    );
    return resultado.insertId;
  },

  async actualizar(id, { palabra, categoria, dificultad, pista }) {
    const [resultado] = await pool.query(
      'UPDATE palabras SET palabra = ?, categoria = ?, pista = ?, dificultad = ? WHERE id = ?',
      [palabra, categoria, pista?.trim() || null, dificultad, id]
    );
    return resultado.affectedRows > 0;
  },

  async eliminar(id) {
    const [resultado] = await pool.query('DELETE FROM palabras WHERE id = ?', [id]);
    return resultado.affectedRows > 0;
  },

  async contarTotal() {
    const [filas] = await pool.query('SELECT COUNT(*) AS total FROM palabras');
    return filas[0].total;
  },

  async contarPorCategoria() {
    const [filas] = await pool.query(
      'SELECT categoria, COUNT(*) AS total FROM palabras GROUP BY categoria ORDER BY total DESC'
    );
    return filas;
  }
};
