const regexTextoPersona = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ' ]+$/;

function limpiarValor(valor) {
  return typeof valor === "string" ? valor.trim() : "";
}

export function validarTextoPersona(valor, campo) {
  const limpio = limpiarValor(valor);

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
  const limpio = limpiarValor(valor);

  if (!limpio) {
    return "La edad es obligatoria";
  }

  if (!/^\d+$/.test(limpio)) {
    return "La edad debe ser numérica";
  }

  const numero = Number(limpio);

  if (!Number.isInteger(numero)) {
    return "La edad debe ser un número entero";
  }

  if (numero < 6 || numero > 20) {
    return "La edad debe estar entre 6 y 20";
  }

  return "";
}

export function validarFormulario(campos) {
  return {
    nombre: validarTextoPersona(campos.nombre.value, "El nombre"),
    apellido: validarTextoPersona(campos.apellido.value, "El apellido"),
    edad: validarEdad(campos.edad.value)
  };
}

export function formularioEsValido(errores) {
  return Object.values(errores).every((error) => error === "");
}

