// funciones sueltas de proposito general

// evita que una funcion se dispare demasiadas veces seguidas (util en buscadores)
export function debounce(funcion, espera = 350) {
  let temporizador;
  return (...args) => {
    clearTimeout(temporizador);
    temporizador = setTimeout(() => funcion(...args), espera);
  };
}

// genera un id corto, lo uso para identificar toasts entre otras cosas
export function generarIdCorto() {
  return Math.random().toString(36).slice(2, 9);
}
