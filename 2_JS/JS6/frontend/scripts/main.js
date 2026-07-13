// este archivo solo inicializa los modulos, no contiene logica de negocio
import { inicializarTema } from './context/theme.context.js';
import { inicializarEventosGlobales } from './modules/events/global.events.js';
import { inicializarEventosJuego } from './modules/events/game.events.js';

document.addEventListener('DOMContentLoaded', () => {
  inicializarTema();
  inicializarEventosGlobales();
  inicializarEventosJuego();
});
