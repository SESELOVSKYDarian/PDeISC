// guardo y leo la preferencia de tema (claro/oscuro) en localStorage
const CLAVE_TEMA = 'ahorcado_tema';

export function guardarTema(tema) {
  localStorage.setItem(CLAVE_TEMA, tema);
}

export function leerTemaGuardado() {
  return localStorage.getItem(CLAVE_TEMA);
}

export function temaPreferidoDelSistema() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'oscuro' : 'claro';
}
