// genera el bloque visual que se muestra cuando una lista no tiene datos
export function renderizarEstadoVacio(mensaje = 'No hay datos para mostrar todavía.', icono = 'inbox') {
  return `
    <div class="estado-vacio animar-entrada">
      <i data-lucide="${icono}" style="width:48px;height:48px;"></i>
      <p>${mensaje}</p>
    </div>
  `;
}
