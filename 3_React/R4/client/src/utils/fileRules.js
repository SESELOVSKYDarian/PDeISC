const MB = 1024 * 1024

// reglas de los archivos que se suben desde el panel (la API las vuelve a validar)
export const fileRules = {
  imagen: {
    mimes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
    extensions: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
    maxBytes: 5 * MB,
    required: true,
    formats: 'JPG, PNG, WEBP o GIF',
    accept: 'image/jpeg,image/png,image/webp,image/gif',
    hint: 'JPG, PNG, WEBP o GIF · máximo 5 MB',
    pickLabel: 'Elegir imagen'
  },
  favicon: {
    mimes: ['image/png', 'image/x-icon', 'image/vnd.microsoft.icon', 'image/jpeg', 'image/webp', 'image/gif'],
    extensions: ['png', 'ico', 'jpg', 'jpeg', 'webp', 'gif'],
    maxBytes: 1 * MB,
    required: false,
    formats: 'PNG, ICO, JPG, WEBP o GIF',
    accept: 'image/png,image/x-icon,image/vnd.microsoft.icon,.ico,image/jpeg,image/webp,image/gif',
    hint: 'PNG, ICO, JPG, WEBP o GIF · máximo 1 MB · mejor si es cuadrada',
    pickLabel: 'Elegir ícono'
  },
  cv: {
    mimes: ['application/pdf'],
    extensions: ['pdf'],
    maxBytes: 10 * MB,
    required: false,
    formats: 'PDF',
    accept: 'application/pdf',
    hint: 'PDF · máximo 10 MB',
    pickLabel: 'Elegir PDF'
  }
}

export const isFileField = (field) => Object.hasOwn(fileRules, field.type)

// devuelve el mensaje de error o '' si el archivo sirve
export function checkFile(file, kind) {
  const rule = fileRules[kind]
  const extension = file.name.split('.').pop().toLowerCase()

  // algunos sistemas no informan el tipo de un .ico: en ese caso vale la extensión (la API revisa el contenido real)
  if ((file.type && !rule.mimes.includes(file.type)) || !rule.extensions.includes(extension)) return `Formato no permitido. Usá ${rule.formats}.`
  if (file.size === 0) return 'El archivo está vacío.'
  if (file.size > rule.maxBytes) return `El archivo pesa más de ${rule.maxBytes / MB} MB.`
  return ''
}

// avisa si falta un archivo obligatorio (por ejemplo, la imagen de un proyecto)
export function missingFileMessage(fields, values) {
  const missing = fields.find((field) => isFileField(field) && fileRules[field.type].required && !values[field.name])
  return missing ? `Subí un archivo en «${missing.label}».` : ''
}
