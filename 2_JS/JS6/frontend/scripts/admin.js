// este archivo solo inicializa los modulos del panel admin
import { inicializarTema } from './context/theme.context.js';
import { inicializarEventosGlobales } from './modules/events/global.events.js';
import { inicializarEventosAdmin } from './modules/events/admin.events.js';

document.addEventListener('DOMContentLoaded', () => {
  inicializarTema();
  inicializarEventosGlobales();
  inicializarEventosAdmin();
});
