// valida los datos de una palabra antes de mandarlos al backend
export function validarPalabraFormulario({ palabra, categoria, dificultad }) {
  const errores = {};
  const palabraLimpia = (palabra || '').trim().toLowerCase();

  if (palabraLimpia.length === 0) {
    errores.palabra = 'La palabra es obligatoria.';
  } else if (palabraLimpia.length < 3 || palabraLimpia.length > 30) {
    errores.palabra = 'La palabra debe tener entre 3 y 30 letras.';
  } else if (!/^[a-záéíóúñü]+$/.test(palabraLimpia)) {
    errores.palabra = 'Solo se permiten letras (sin números ni símbolos).';
  }

  if (!categoria || categoria.trim().length === 0) {
    errores.categoria = 'La categoría es obligatoria.';
  }

  if (!['facil', 'media', 'dificil'].includes(dificultad)) {
    errores.dificultad = 'Elegí una dificultad válida.';
  }

  return { valido: Object.keys(errores).length === 0, errores };
}
