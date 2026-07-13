// controla en que pagina esta el ranking actualmente
let paginaActual = 1;
const porPagina = 8;

export function irAPagina(numero) {
  paginaActual = numero;
  return paginaActual;
}

export function reiniciarPagina() {
  paginaActual = 1;
}

export function obtenerPaginaActual() {
  return paginaActual;
}

export function obtenerPorPagina() {
  return porPagina;
}
