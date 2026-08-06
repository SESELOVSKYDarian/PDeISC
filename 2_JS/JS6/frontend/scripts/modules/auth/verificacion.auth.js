// inicializa la pantalla del código y crea la sesión al completar la verificación
import { inicializarTema } from '../../context/theme.context.js';
import { inicializarEventosGlobales } from '../events/global.events.js';
import { AuthApi } from '../../api/auth.api.js';
import { activarCargaBoton, desactivarCargaBoton } from '../ui/loader.js';

document.addEventListener('DOMContentLoaded', () => {
  inicializarTema();
  inicializarEventosGlobales();
  const email = sessionStorage.getItem('admin_email_pendiente');
  const formulario = document.querySelector('[data-form-verificacion]');
  const mensaje = document.querySelector('[data-mensaje-auth]');
  if (!email) { window.location.href = '/pages/admin-login.html'; return; }
  document.querySelector('[data-email-destino]').textContent = email;
  formulario?.addEventListener('submit', async (evento) => {
    evento.preventDefault();
    const boton = formulario.querySelector('button[type="submit"]');
    mensaje.textContent = '';
    activarCargaBoton(boton, 'Validando...');
    try {
      await AuthApi.verificarCodigo(email, formulario.codigo.value.trim());
      sessionStorage.removeItem('admin_email_pendiente');
      window.location.href = '/pages/admin.html';
    } catch (error) {
      mensaje.textContent = error.message;
      mensaje.className = 'auth-mensaje auth-mensaje--error';
    } finally { desactivarCargaBoton(boton); }
  });
});
