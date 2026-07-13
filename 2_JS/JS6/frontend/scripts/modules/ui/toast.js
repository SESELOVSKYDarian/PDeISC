// sistema generico de notificaciones toast, nada de alert()
import { generarIdCorto } from '../../utils/helpers.js';

const ICONOS = {
  exito: 'check-circle',
  error: 'x-circle',
  advertencia: 'alert-triangle',
  info: 'info'
};

const DURACION_MS = 4000;

function asegurarContenedor() {
  let contenedor = document.querySelector('.toast-contenedor');
  if (!contenedor) {
    contenedor = document.createElement('div');
    contenedor.className = 'toast-contenedor';
    contenedor.setAttribute('aria-live', 'polite');
    contenedor.setAttribute('role', 'status');
    document.body.appendChild(contenedor);
  }
  return contenedor;
}

export function mostrarToast(mensaje, tipo = 'info') {
  const contenedor = asegurarContenedor();
  const id = generarIdCorto();

  const toast = document.createElement('div');
  toast.className = `toast toast--${tipo}`;
  toast.id = `toast-${id}`;
  toast.innerHTML = `
    <span class="toast__icono"><i data-lucide="${ICONOS[tipo] || 'info'}"></i></span>
    <span class="toast__texto">${mensaje}</span>
    <button type="button" class="toast__cerrar" aria-label="Cerrar notificación">
      <i data-lucide="x"></i>
    </button>
    <span class="toast__barra" style="animation-duration: ${DURACION_MS}ms"></span>
  `;

  contenedor.appendChild(toast);
  if (window.lucide) window.lucide.createIcons();

  const cerrar = () => cerrarToast(toast);
  toast.querySelector('.toast__cerrar').addEventListener('click', cerrar);

  let temporizador = setTimeout(cerrar, DURACION_MS);
  toast.addEventListener('mouseenter', () => clearTimeout(temporizador));
  toast.addEventListener('mouseleave', () => { temporizador = setTimeout(cerrar, 1200); });

  return toast;
}

function cerrarToast(toast) {
  toast.classList.add('toast--saliendo');
  toast.addEventListener('animationend', () => toast.remove(), { once: true });
}
