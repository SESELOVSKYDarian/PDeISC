export const validateContact = (values) => {
  const errors = {}
  const unsafeMarkup = /<|>|javascript\s*:|on\w+\s*=/i
  for (const field of ['nombre', 'email', 'asunto', 'mensaje']) {
    if (unsafeMarkup.test(values[field])) errors[field] = 'No se permiten etiquetas ni código.'
  }
  if (values.nombre.trim().length < 2) errors.nombre = 'Ingresá al menos 2 caracteres.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) errors.email = 'Ingresá un correo válido.'
  if (values.asunto.trim().length < 3) errors.asunto = 'Ingresá un asunto más claro.'
  if (values.mensaje.trim().length < 10) errors.mensaje = 'El mensaje debe tener al menos 10 caracteres.'
  return errors
}
