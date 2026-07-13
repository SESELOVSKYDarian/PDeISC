// dibuja los guiones/letras de la palabra oculta en el DOM
import { animarLetraRevelada } from '../animations/letters.animations.js';

export function renderizarPalabraOculta(ahorcado) {
  const contenedor = document.querySelector('[data-palabra-oculta]');
  if (!contenedor) return;

  const letrasVisibles = ahorcado.palabraManager.obtenerLetrasVisibles();

  if (contenedor.children.length !== letrasVisibles.length) {
    contenedor.innerHTML = letrasVisibles.map(() => '<span class="palabra-oculta__letra" aria-label="letra oculta"></span>').join('');
  }

  [...contenedor.children].forEach((casillero, indice) => {
    const letraAnterior = casillero.textContent;
    const letraNueva = letrasVisibles[indice] || '';
    if (letraAnterior === letraNueva) return;

    casillero.textContent = letraNueva;
    casillero.setAttribute('aria-label', letraNueva || 'letra oculta');
    casillero.classList.remove('palabra-oculta__letra--revelada');
    if (!letraAnterior && letraNueva) animarLetraRevelada(casillero);
  });
}
