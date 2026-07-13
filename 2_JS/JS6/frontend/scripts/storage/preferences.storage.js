// guardo cositas menores del usuario, como el ultimo nombre usado para el ranking
const CLAVE_NOMBRE = 'ahorcado_ultimo_nombre';

export function guardarUltimoNombre(nombre) {
  localStorage.setItem(CLAVE_NOMBRE, nombre);
}

export function leerUltimoNombre() {
  return localStorage.getItem(CLAVE_NOMBRE) || '';
}
