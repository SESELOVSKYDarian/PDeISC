const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const urlPattern = /^(https?:\/\/|\/)[^\s]+$/i
const unsafeMarkupPattern = /<|>|javascript\s*:|on\w+\s*=/i

export const cleanText = (value, max = 500) => String(value ?? '').trim().slice(0, max)
export const isEmail = (value) => emailPattern.test(cleanText(value, 160))
export const isUrl = (value) => !value || urlPattern.test(cleanText(value, 500))
export const toPositiveId = (value) => {
  const id = Number(value)
  return Number.isInteger(id) && id > 0 ? id : null
}
export const toBoolean = (value) => value === true || value === 1 || value === '1'
export const toOrder = (value) => {
  const order = Number(value)
  return Number.isInteger(order) && order >= 0 ? order : 0
}

export const validateContact = (body = {}) => {
  const data = {
    nombre: cleanText(body.nombre, 80),
    email: cleanText(body.email, 160).toLowerCase(),
    asunto: cleanText(body.asunto, 120),
    mensaje: cleanText(body.mensaje, 2000)
  }
  const errors = {}
  for (const field of ['nombre', 'email', 'asunto', 'mensaje']) {
    if (unsafeMarkupPattern.test(String(body[field] ?? ''))) {
      errors[field] = 'No se permiten etiquetas ni código en este campo.'
    }
  }
  if (data.nombre.length < 2) errors.nombre = 'Ingresá un nombre de al menos 2 caracteres.'
  if (!isEmail(data.email)) errors.email = 'Ingresá un correo válido.'
  if (data.asunto.length < 3) errors.asunto = 'El asunto debe tener al menos 3 caracteres.'
  if (data.mensaje.length < 10) errors.mensaje = 'El mensaje debe tener al menos 10 caracteres.'
  return { data, errors }
}

export const validateLogin = (body = {}) => {
  const email = cleanText(body.email, 160).toLowerCase()
  const password = String(body.password ?? '')
  return {
    data: { email, password },
    valid: isEmail(email) && password.length >= 8 && password.length <= 72
  }
}
