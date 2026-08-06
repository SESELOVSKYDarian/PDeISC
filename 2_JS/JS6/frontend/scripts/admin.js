// este archivo solo inicializa los modulos del panel admin
import { inicializarTema } from './context/theme.context.js';
import { inicializarEventosGlobales } from './modules/events/global.events.js';
import { inicializarEventosAdmin } from './modules/events/admin.events.js';
import { AuthApi } from './api/auth.api.js';

document.addEventListener('DOMContentLoaded', async () => {
  try { await AuthApi.obtenerSesion(); } catch { window.location.href = './admin-login.html'; return; }
  inicializarTema();
  inicializarEventosGlobales();
  inicializarEventosAdmin();
});
