// valida el nombre que se usa para guardar el score
export function validarNombre(nombre) {
  const limpio = (nombre || '').trim();

  if (limpio.length === 0) {
    return { valido: false, mensaje: 'El nombre es obligatorio.' };
  }
  if (limpio.length < 2 || limpio.length > 40) {
    return { valido: false, mensaje: 'El nombre debe tener entre 2 y 40 caracteres.' };
  }
  if (!/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s]+$/.test(limpio)) {
    return { valido: false, mensaje: 'Solo se permiten letras, números y espacios.' };
  }
  return { valido: true, mensaje: '' };
}
