// Modulo nativo: File System
// Funciones minimas para escribir y leer archivos dentro del proyecto.

import fs from 'node:fs';
import path from 'node:path';

export function escribirArchivo(rutaArchivo, contenido) {
  // Crea la carpeta destino si todavia no existe.
  const carpeta = path.dirname(rutaArchivo);
  if (!fs.existsSync(carpeta)) {
    fs.mkdirSync(carpeta, { recursive: true });
  }
  fs.writeFileSync(rutaArchivo, contenido, 'utf8');
}

export function leerArchivo(rutaArchivo) {
  // Lee el archivo completo como texto UTF-8.
  return fs.readFileSync(rutaArchivo, 'utf8');
}
