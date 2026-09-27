import { query } from './db.js'

export const fileUrl = (id: number): string => `/archivos/${id}`

export interface SaveFileInput {
  nombre: string;
  mime: string;
  buffer: Buffer;
}

export interface StoredFile {
  nombre: string;
  tipo_mime: string;
  contenido: Buffer;
}

export async function saveFile({ nombre, mime, buffer }: SaveFileInput): Promise<number> {
  const result = await query<{ insertId: number }>('INSERT INTO archivos (nombre, tipo_mime, tamano, contenido) VALUES (?, ?, ?, ?)', [nombre, mime, buffer.length, buffer])
  return result.insertId
}

export async function findFile(id: number): Promise<StoredFile | undefined> {
  const [file] = await query<StoredFile[]>('SELECT nombre, tipo_mime, contenido FROM archivos WHERE id = ?', [id])
  return file
}

// borra los archivos subidos que ningún registro usa (con una hora de margen por si todavía no se guardó el formulario)
export async function deleteUnusedFiles(): Promise<void> {
  await query(`DELETE a FROM archivos a
    WHERE a.creado_en < NOW() - INTERVAL 1 HOUR
      AND NOT EXISTS (SELECT 1 FROM perfil p WHERE p.retrato_url = CONCAT('/archivos/', a.id) OR p.cv_url = CONCAT('/archivos/', a.id) OR p.favicon_url = CONCAT('/archivos/', a.id))
      AND NOT EXISTS (SELECT 1 FROM proyectos p WHERE p.imagen_url = CONCAT('/archivos/', a.id))
      AND NOT EXISTS (SELECT 1 FROM categorias_habilidades c WHERE c.imagen_url = CONCAT('/archivos/', a.id))`)
}
