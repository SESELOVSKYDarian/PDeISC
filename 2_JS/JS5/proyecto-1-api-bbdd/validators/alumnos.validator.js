const regexTextoPersona = /^[\p{L}' ]+$/u;

function limpiarTexto(valor) {
  return typeof valor === "string" ? valor.trim() : "";
}

export function validarTextoPersona(valor, campo) {
  if (valor === undefined || valor === null) {
    return `${campo} es obligatorio`;
  }

  const limpio = limpiarTexto(valor);

  if (!limpio) {
    return `${campo} es obligatorio`;
  }

  if (limpio.length > 100) {
    return `${campo} no puede superar los 100 caracteres`;
  }

  if (!regexTextoPersona.test(limpio)) {
    return `${campo} solo puede contener letras, espacios y apóstrofes`;
  }

  return "";
}

export function validarEdad(valor) {
  if (valor === undefined || valor === null || valor === "") {
    return "La edad es obligatoria";
  }

  const numeroEdad = Number(valor);

  if (!Number.isInteger(numeroEdad)) {
    return "La edad debe ser un número entero";
  }

  if (numeroEdad < 6 || numeroEdad > 20) {
    return "La edad debe estar entre 6 y 20";
  }

  return "";
}

export function validarAlumno(datos = {}) {
  const errores = [];

  const errorNombre = validarTextoPersona(datos.nombre, "El nombre");
  const errorApellido = validarTextoPersona(datos.apellido, "El apellido");
  const errorEdad = validarEdad(datos.edad);

  if (errorNombre) errores.push(errorNombre);
  if (errorApellido) errores.push(errorApellido);
  if (errorEdad) errores.push(errorEdad);

  return errores;
}

export function validarId(id) {
  const numeroId = Number(id);

  if (!Number.isInteger(numeroId) || numeroId <= 0) {
    return "El id debe ser un número válido";
  }

  return "";
}

