// controla el cambio de tema en toda la app, y lo deja aplicado en el html
import { guardarTema, leerTemaGuardado, temaPreferidoDelSistema } from '../storage/theme.storage.js';

let temaActual = 'claro';

export function inicializarTema() {
  const guardado = leerTemaGuardado();
  temaActual = guardado || temaPreferidoDelSistema();
  aplicarTema(temaActual);
}

export function aplicarTema(tema) {
  temaActual = tema;
  document.documentElement.setAttribute('data-tema', tema);
  guardarTema(tema);
  actualizarIconoBotonTema();
}

export function alternarTema() {
  aplicarTema(temaActual === 'claro' ? 'oscuro' : 'claro');
}

export function obtenerTemaActual() {
  return temaActual;
}

// cambio el icono del boton de tema (sol/luna) segun el tema activo
function actualizarIconoBotonTema() {
  const boton = document.querySelector('[data-boton-tema]');
  if (!boton) return;
  const icono = temaActual === 'claro' ? 'moon' : 'sun';
  boton.innerHTML = `<span class="icono-mask icono-mask--${icono}" aria-hidden="true"></span>`;
  boton.setAttribute('aria-label', temaActual === 'claro' ? 'Activar modo oscuro' : 'Activar modo claro');
}
