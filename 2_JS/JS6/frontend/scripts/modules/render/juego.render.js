// pinta el panel de info (intentos, tiempo, puntos, categoria/dificultad)
import { formatearTiempo } from '../../utils/fechas.js';
import { capitalizar } from '../../utils/formatters.js';

export function renderizarPanelInfo(ahorcado) {
  const intentos = document.querySelectorAll('[data-panel-intentos]');
  const tiempo = document.querySelector('[data-panel-tiempo]');
  const puntos = document.querySelector('[data-panel-puntos]');
  const dificultad = document.querySelector('[data-panel-dificultad]');

  intentos.forEach(elemento => { elemento.textContent = ahorcado.intentosManager.quedanIntentos(); });
  if (tiempo) tiempo.textContent = formatearTiempo(ahorcado.segundosTranscurridos);
  if (puntos) puntos.textContent = ahorcado.puntuacionManager.obtenerPuntos();

  if (dificultad) {
    dificultad.textContent = capitalizar(ahorcado.dificultad);
    dificultad.className = `badge-dificultad badge-dificultad--${ahorcado.dificultad}`;
  }
}
