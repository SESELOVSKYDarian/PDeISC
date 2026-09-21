import { cleanText } from './validators.js'

const MB = 1024 * 1024

// qué se puede subir en cada caso (imagen del portfolio o currículum)
export const fileKinds = {
  imagen: {
    mimes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
    maxBytes: 5 * MB,
    message: 'La imagen debe ser JPG, PNG, WEBP o GIF de hasta 5 MB.'
  },
  favicon: {
    mimes: ['image/png', 'image/x-icon', 'image/jpeg', 'image/webp', 'image/gif'],
    maxBytes: 1 * MB,
    message: 'El favicon debe ser PNG, ICO, JPG, WEBP o GIF de hasta 1 MB.'
  },
  cv: {
    mimes: ['application/pdf'],
    maxBytes: 10 * MB,
    message: 'El currículum debe ser un PDF de hasta 10 MB.'
  }
}

const startsWith = (buffer, bytes, offset = 0) => bytes.every((byte, index) => buffer[offset + index] === byte)

// el formato se sabe por los primeros bytes del archivo, no por su nombre ni por lo que diga el navegador
export function detectMime(buffer) {
  if (startsWith(buffer, [0xff, 0xd8, 0xff])) return 'image/jpeg'
  if (startsWith(buffer, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) return 'image/png'
  if (startsWith(buffer, [0x47, 0x49, 0x46, 0x38])) return 'image/gif'
  if (startsWith(buffer, [0x52, 0x49, 0x46, 0x46]) && startsWith(buffer, [0x57, 0x45, 0x42, 0x50], 8)) return 'image/webp'
  if (startsWith(buffer, [0x25, 0x50, 0x44, 0x46, 0x2d])) return 'application/pdf'
  if (startsWith(buffer, [0x00, 0x00, 0x01, 0x00])) return 'image/x-icon'
  return null
}

const cleanFileName = (name) => cleanText(String(name ?? '').replace(/[/\\]/g, '_').replace(/[\u0000-\u001f]/g, ''), 160) || 'archivo'

// devuelve { error } o { buffer, mime, nombre }
export function validateUpload(body = {}) {
  if (typeof body.tipo !== 'string' || !Object.hasOwn(fileKinds, body.tipo)) return { error: 'Tipo de archivo no válido.' }
  const kind = fileKinds[body.tipo]

  if (typeof body.contenido !== 'string' || !body.contenido) return { error: 'Elegí un archivo para subir.' }
  const buffer = Buffer.from(body.contenido, 'base64')

  if (buffer.length === 0) return { error: 'El archivo está vacío.' }
  if (buffer.length > kind.maxBytes) return { error: kind.message }

  const mime = detectMime(buffer)
  if (!mime || !kind.mimes.includes(mime)) return { error: kind.message }

  return { buffer, mime, nombre: cleanFileName(body.nombre) }
}
