// reemplaza al confirm() nativo con un modal accesible y animado
import { abrirModal, cerrarModal } from './modal.js';

export function pedirConfirmacion({ titulo = '¿Estás seguro?', mensaje, textoConfirmar = 'Eliminar', onConfirmar }) {
  abrirModal({
    titulo,
    contenidoHtml: `
      <p>${mensaje}</p>
      <div class="modal__acciones">
        <button type="button" class="boton" data-cancelar>Cancelar</button>
        <button type="button" class="boton boton--peligro" data-confirmar>${textoConfirmar}</button>
      </div>
    `,
    alAbrir(cuerpo) {
      cuerpo.querySelector('[data-cancelar]').addEventListener('click', cerrarModal);
      cuerpo.querySelector('[data-confirmar]').addEventListener('click', () => {
        cerrarModal();
        onConfirmar();
      });
    }
  });
}
