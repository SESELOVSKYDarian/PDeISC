// sistema generico de modales: cualquier modulo puede pedir "abrime un modal con este contenido"
let elementoFondo = null;
let elementoAnterior = null;

function asegurarContenedor() {
  if (elementoFondo) return elementoFondo;

  elementoFondo = document.createElement('div');
  elementoFondo.className = 'modal-fondo';
  elementoFondo.innerHTML = `
    <div class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-titulo">
      <div class="modal__cabecera">
        <h3 id="modal-titulo"></h3>
        <button type="button" class="modal__cerrar" aria-label="Cerrar modal" data-cerrar-modal>
          <i data-lucide="x"></i>
        </button>
      </div>
      <div class="modal__cuerpo"></div>
    </div>
  `;
  document.body.appendChild(elementoFondo);

  elementoFondo.addEventListener('click', (evento) => {
    if (evento.target === elementoFondo) cerrarModal();
  });
  elementoFondo.querySelector('[data-cerrar-modal]').addEventListener('click', cerrarModal);

  document.addEventListener('keydown', (evento) => {
    if (evento.key === 'Escape' && elementoFondo.classList.contains('modal-fondo--abierto')) {
      cerrarModal();
    }
  });

  return elementoFondo;
}

export function abrirModal({ titulo, contenidoHtml, alAbrir }) {
  const fondo = asegurarContenedor();
  elementoAnterior = document.activeElement;

  fondo.querySelector('#modal-titulo').textContent = titulo;
  fondo.querySelector('.modal__cuerpo').innerHTML = contenidoHtml;

  fondo.classList.remove('modal-fondo--cerrando');
  fondo.classList.add('modal-fondo--abierto');
  document.body.style.overflow = 'hidden';
  if (window.lucide) window.lucide.createIcons();

  // muevo el foco al primer campo interactivo del modal
  const primerFocal = fondo.querySelector('input, select, textarea, button:not([data-cerrar-modal])');
  if (primerFocal) primerFocal.focus();

  atraparFoco(fondo);

  if (alAbrir) alAbrir(fondo.querySelector('.modal__cuerpo'));
}

export function cerrarModal() {
  if (!elementoFondo) return;
  elementoFondo.classList.add('modal-fondo--cerrando');
  elementoFondo.classList.remove('modal-fondo--abierto');
  document.body.style.overflow = '';
  setTimeout(() => {
    elementoFondo?.classList.remove('modal-fondo--cerrando');
    if (elementoAnterior) elementoAnterior.focus();
  }, 280);
}

// mantiene el foco dentro del modal mientras esta abierto (accesibilidad)
function atraparFoco(fondo) {
  const focales = fondo.querySelectorAll('button, input, select, textarea, a[href]');
  if (focales.length === 0) return;
  const primero = focales[0];
  const ultimo = focales[focales.length - 1];

  fondo.onkeydown = (evento) => {
    if (evento.key !== 'Tab') return;
    if (evento.shiftKey && document.activeElement === primero) {
      evento.preventDefault();
      ultimo.focus();
    } else if (!evento.shiftKey && document.activeElement === ultimo) {
      evento.preventDefault();
      primero.focus();
    }
  };
}
