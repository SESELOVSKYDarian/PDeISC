// controla por que columna y en que direccion esta ordenado el ranking actualmente
let ordenActual = { columna: 'puntos', direccion: 'DESC' };

export function alternarOrden(columna) {
  if (ordenActual.columna === columna) {
    ordenActual.direccion = ordenActual.direccion === 'DESC' ? 'ASC' : 'DESC';
  } else {
    ordenActual = { columna, direccion: 'DESC' };
  }
  return ordenActual;
}

export function obtenerOrdenActual() {
  return ordenActual;
}
