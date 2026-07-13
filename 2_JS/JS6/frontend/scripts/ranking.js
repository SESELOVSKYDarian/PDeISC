// este archivo solo inicializa los modulos de la pagina de ranking
import { inicializarTema } from './context/theme.context.js';
import { inicializarEventosGlobales } from './modules/events/global.events.js';
import { inicializarEventosRanking } from './modules/events/ranking.events.js';

document.addEventListener('DOMContentLoaded', () => {
  inicializarTema();
  inicializarEventosGlobales();
  inicializarEventosRanking();
});
