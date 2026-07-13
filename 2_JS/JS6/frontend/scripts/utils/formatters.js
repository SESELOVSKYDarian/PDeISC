// funciones de formateo de texto que uso en varios modulos

export function capitalizar(texto) {
  if (!texto) return '';
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

export function truncar(texto, largoMaximo = 40) {
  if (texto.length <= largoMaximo) return texto;
  return texto.slice(0, largoMaximo - 1) + '…';
}
