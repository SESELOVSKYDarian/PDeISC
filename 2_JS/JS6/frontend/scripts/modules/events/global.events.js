// eventos que aplican a todas las paginas: tema, menu hamburguesa, boton volver arriba
import { alternarTema } from '../../context/theme.context.js';
import { animarEntradaPagina } from '../animations/page.animations.js';

export function inicializarEventosGlobales() {
  animarEntradaPagina();

  const botonTema = document.querySelector('[data-boton-tema]');
  if (botonTema) {
    botonTema.addEventListener('click', alternarTema);
  }

  const botonMenu = document.querySelector('[data-boton-menu]');
  const enlacesNav = document.querySelector('[data-enlaces-nav]');
  if (botonMenu && enlacesNav) {
    botonMenu.addEventListener('click', () => {
      const abierto = enlacesNav.classList.toggle('abierto');
      botonMenu.setAttribute('aria-expanded', String(abierto));
    });
  }

  const botonVolverArriba = document.querySelector('[data-volver-arriba]');
  if (botonVolverArriba) {
    window.addEventListener('scroll', () => {
      botonVolverArriba.classList.toggle('visible', window.scrollY > 400);
    });
    botonVolverArriba.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  if (window.lucide) window.lucide.createIcons();
}
