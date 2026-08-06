// inicializa la pantalla de credenciales del administrador y deriva al segundo paso
import { inicializarTema } from '../../context/theme.context.js';
import { inicializarEventosGlobales } from '../events/global.events.js';
import { AuthApi } from '../../api/auth.api.js';
import { activarCargaBoton, desactivarCargaBoton } from '../ui/loader.js';

document.addEventListener('DOMContentLoaded', () => {
  inicializarTema();
  inicializarEventosGlobales();
  const formulario = document.querySelector('[data-form-login]');
  const mensaje = document.querySelector('[data-mensaje-auth]');
  formulario?.addEventListener('submit', async (evento) => {
    evento.preventDefault();
    const boton = formulario.querySelector('button[type="submit"]');
    const email = formulario.email.value.trim();
    const password = formulario.password.value;
    mensaje.textContent = '';
    activarCargaBoton(boton, 'Verificando...');
    try {
      await AuthApi.solicitarCodigo(email, password);
      sessionStorage.setItem('admin_email_pendiente', email);
      window.location.href = '/pages/admin-verificacion.html';
    } catch (error) {
      mensaje.textContent = error.message;
      mensaje.className = 'auth-mensaje auth-mensaje--error';
    } finally { desactivarCargaBoton(boton); }
  });
});
