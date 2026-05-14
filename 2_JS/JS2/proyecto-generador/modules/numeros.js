// convierte texto de un txt en un array de numeros validos
export function leerNumerosDesdeTexto(texto) {
  if (typeof texto !== "string") return [];

  return texto
    .split(/\r?\n|,|;/)
    .map((item) => item.trim())
    .filter(Boolean)
    .map(Number);
}

// revisa que cada valor del array sea un numero real
export function sonNumerosValidos(numeros) {
  return Array.isArray(numeros) && numeros.every((numero) => typeof numero === "number" && Number.isFinite(numero));
}

// detecta valores repetidos y cuenta cuantas repeticiones extras hay
export function obtenerRepetidos(numeros) {
  const conteo = new Map();

  numeros.forEach((numero) => {
    conteo.set(numero, (conteo.get(numero) || 0) + 1);
  });

  const valores = [...conteo.entries()]
    .filter(([, cantidad]) => cantidad > 1)
    .map(([numero, cantidad]) => ({ numero, cantidad }));
  const cantidad = valores.reduce((total, item) => total + item.cantidad - 1, 0);

  return { cantidad, valores };
}

// valida que no haya numeros repetidos en la carga o edicion
export function validarSinRepetidos(numeros) {
  const repetidos = obtenerRepetidos(numeros);
  if (repetidos.cantidad === 0) return "";

  const detalle = repetidos.valores.map((item) => `${item.numero} (${item.cantidad} veces)`).join(", ");
  return `No se permiten numeros repetidos. Se encontraron ${repetidos.cantidad} repetidos: ${detalle}.`;
}

// valida la cantidad pedida para finalizar el archivo
export function validarCantidad(numeros) {
  if (!Array.isArray(numeros)) {
    return "Los datos deben enviarse en un array.";
  }

  if (numeros.length < 10) {
    return "Debe cargar como minimo 10 numeros.";
  }

  if (numeros.length > 20) {
    return "No puede cargar mas de 20 numeros.";
  }

  return "";
}

// prepara el contenido limpio que se guarda dentro del txt
export function crearContenidoTxt(numeros) {
  return numeros.map((numero) => String(numero)).join("\n");
}

// valida el contenido editado antes de volver a guardar el txt
export function validarContenidoTxt(contenido) {
  const numeros = leerNumerosDesdeTexto(contenido);

  if (!sonNumerosValidos(numeros)) {
    return { ok: false, error: "El archivo solo puede contener numeros." };
  }

  const errorCantidad = validarCantidad(numeros);
  if (errorCantidad) {
    return { ok: false, error: errorCantidad };
  }

  const errorRepetidos = validarSinRepetidos(numeros);
  if (errorRepetidos) {
    return { ok: false, error: errorRepetidos };
  }

  return { ok: true, numeros };
}
