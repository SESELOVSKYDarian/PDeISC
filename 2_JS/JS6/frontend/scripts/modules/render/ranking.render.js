// pinta la tabla del ranking con los scores que llegan del backend
import { formatearFechaCorta } from '../../utils/fechas.js';
import { renderizarEstadoVacio } from '../ui/emptyState.js';

export function renderizarTablaRanking(scores) {
  const cuerpo = document.querySelector('[data-cuerpo-tabla-ranking]');
  if (!cuerpo) return;

  if (scores.length === 0) {
    cuerpo.innerHTML = `<tr><td colspan="4">${renderizarEstadoVacio('Todavía no hay puntajes guardados.', 'trophy')}</td></tr>`;
    if (window.lucide) window.lucide.createIcons();
    return;
  }

  cuerpo.innerHTML = scores.map(item => `
    <tr>
      <td>${item.nombre}</td>
      <td>${item.puntos}</td>
      <td>${item.tiempo}s</td>
      <td>${formatearFechaCorta(item.fecha)}</td>
    </tr>
  `).join('');

  if (window.lucide) window.lucide.createIcons();
}

export function renderizarPaginacion(total, pagina, porPagina) {
  const contenedor = document.querySelector('[data-paginacion-ranking]');
  if (!contenedor) return;

  const totalPaginas = Math.max(1, Math.ceil(total / porPagina));
  let html = '';

  for (let i = 1; i <= totalPaginas; i++) {
    html += `
      <button type="button" class="boton boton--chico paginacion__boton" data-pagina="${i}" ${i === pagina ? 'aria-current="page"' : ''}>
        ${i}
      </button>
    `;
  }

  contenedor.innerHTML = html;
}
