// valida que el texto ingresado represente un numero
export function validarNumero(valor) {
  const limpio = String(valor).trim();
  return limpio !== "" && Number.isFinite(Number(limpio));
}

// devuelve un mensaje segun la cantidad cargada
export function validarCantidad(numeros) {
  if (numeros.length < 10) return "Cargue al menos 10 numeros para finalizar.";
  if (numeros.length > 20) return "No se pueden cargar mas de 20 numeros.";
  return "";
}

// revisa si el numero ya existe en la lista cargada
export function numeroRepetido(numeros, valor) {
  return numeros.includes(Number(valor));
}

// marca visualmente un input segun su estado
export function marcarInput(input, esValido) {
  input.classList.toggle("is-valid", esValido);
  input.classList.toggle("is-invalid", !esValido);
}
