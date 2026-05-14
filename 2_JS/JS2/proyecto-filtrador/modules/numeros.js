// convierte contenido de texto en numeros separados por saltos, comas o punto y coma
export function leerNumerosDesdeTexto(texto) {
  if (typeof texto !== "string") return [];

  return texto
    .split(/\r?\n|,|;/)
    .map((item) => item.trim())
    .filter(Boolean)
    .map(Number);
}

// valida que todos los valores sean numeros reales
export function sonNumerosValidos(numeros) {
  return Array.isArray(numeros) && numeros.length > 0 && numeros.every((numero) => typeof numero === "number" && Number.isFinite(numero));
}

// detecta valores repetidos y devuelve una metrica clara
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

// arma un mensaje de rechazo cuando hay repetidos
export function crearMensajeRepetidos(repetidos) {
  const detalle = repetidos.valores.map((item) => `${item.numero} (${item.cantidad} veces)`).join(", ");
  return `Se encontraron numeros repetidos. Cantidad de repetidos: ${repetidos.cantidad}. Detalle: ${detalle}.`;
}

// indica si un numero empieza y termina con el mismo digito
export function obtenerDigitos(numero) {
  const texto = String(Math.abs(numero)).replace(".", "");
  return texto;
}

// indica si el numero tiene un solo digito y debe omitirse del filtrado
export function esNumeroUnDigito(numero) {
  return obtenerDigitos(numero).length === 1;
}

// indica si un numero empieza y termina con el mismo digito
export function esNumeroUtil(numero) {
  const texto = obtenerDigitos(numero);
  if (texto.length === 1) return false;

  return texto[0] === texto[texto.length - 1];
}

// identifica si el numero es resultado de un factorial entero positivo
export function obtenerFactorial(numero) {
  if (!Number.isInteger(numero) || numero < 1 || !Number.isSafeInteger(numero)) return null;
  if (numero === 1) return { numero, n: 1, expresion: "1!" };

  let acumulado = 1;
  for (let n = 2; acumulado <= numero && Number.isSafeInteger(acumulado); n += 1) {
    acumulado *= n;
    if (acumulado === numero) return { numero, n, expresion: `${n}!` };
  }

  return null;
}

// devuelve solo los numeros que son factoriales
export function obtenerFactoriales(numeros) {
  return numeros.map(obtenerFactorial).filter(Boolean);
}

// filtra ordena y calcula estadisticas del array recibido
export function filtrarNumeros(numeros) {
  const utiles = numeros.filter(esNumeroUtil).sort((a, b) => a - b);
  const noUtiles = numeros.filter((n) => !esNumeroUtil(n));
  const porcentaje = numeros.length === 0 ? 0 : Number(((utiles.length * 100) / numeros.length).toFixed(2));
  const repetidos = obtenerRepetidos(numeros);
  const factoriales = obtenerFactoriales(numeros);
  const factorialesUtiles = obtenerFactoriales(utiles);

  return {
    numerosOriginales: numeros,
    utiles,
    noUtiles,
    contadorUtiles: utiles.length,
    contadorNoUtiles: noUtiles.length,
    porcentaje,
    repetidos,
    factoriales,
    factorialesUtiles
  };
}

// arma el txt de resultado con datos claros del filtrado
export function crearContenidoResultado(resultado) {
  return [
    "Numeros filtrados que empiezan y terminan con el mismo digito:",
    ...resultado.utiles.map(String),
    "",
    "Numeros factoriales detectados en el archivo:",
    ...(resultado.factoriales.length > 0
      ? resultado.factoriales.map((item) => `${item.numero} -> ${item.expresion}`)
      : ["No se encontraron factoriales en el archivo."]),
    "",
    `Cantidad de utiles: ${resultado.contadorUtiles}`,
    `Cantidad de no utiles: ${resultado.contadorNoUtiles}`,
    `Porcentaje de utiles: ${resultado.porcentaje}%`,
    `Cantidad de numeros repetidos detectados: ${resultado.repetidos.cantidad}`
  ].join("\n");
}

// valida texto editado para que no se guarde contenido vacio
export function validarContenidoEditable(contenido) {
  if (typeof contenido !== "string" || contenido.trim() === "") {
    return { ok: false, error: "El contenido no puede quedar vacio." };
  }

  const numeros = leerNumerosDesdeTexto(contenido);
  if (sonNumerosValidos(numeros)) {
    const repetidos = obtenerRepetidos(numeros);
    if (repetidos.cantidad > 0) {
      return { ok: false, error: crearMensajeRepetidos(repetidos), repetidos };
    }
  }

  return { ok: true, contenido: contenido.trim() };
}
