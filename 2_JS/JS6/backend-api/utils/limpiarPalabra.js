// esta funcion deja una palabra "lista para guardar": sin espacios raros, sin numeros, en minusculas

export function limpiarPalabra(texto) {
  if (typeof texto !== 'string') return '';

  let limpia = texto.trim().toLowerCase();

  // saco acentos para guardar todo de forma mas consistente en la base
  limpia = limpia.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  // me quedo solo con letras (ya sin numeros ni simbolos)
  limpia = limpia.replace(/[^a-záéíóúñü]/gi, '');

  return limpia;
}

// chequea si una palabra ya limpia cumple con largo minimo y maximo razonable
export function esPalabraValida(palabra, minimo = 3, maximo = 30) {
  return typeof palabra === 'string' && palabra.length >= minimo && palabra.length <= maximo;
}
