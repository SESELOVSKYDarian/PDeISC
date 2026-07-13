// pinta la tabla de palabras en el panel administrador
import { capitalizar } from '../../utils/formatters.js';
import { renderizarEstadoVacio } from '../ui/emptyState.js';

export function renderizarTablaPalabras(palabras) {
  const cuerpo = document.querySelector('[data-cuerpo-tabla-palabras]');
  if (!cuerpo) return;

  if (palabras.length === 0) {
    cuerpo.innerHTML = `<tr><td colspan="5">${renderizarEstadoVacio('No hay palabras cargadas todavía.', 'book-x')}</td></tr>`;
    if (window.lucide) window.lucide.createIcons();
    return;
  }

  cuerpo.innerHTML = palabras.map(item => `
    <tr>
      <td>${item.palabra}</td>
      <td>${capitalizar(item.categoria)}</td>
      <td><span class="badge-dificultad badge-dificultad--${item.dificultad}">${capitalizar(item.dificultad)}</span></td>
      <td>${new Date(item.fecha_creacion).toLocaleDateString('es-AR')}</td>
      <td class="tabla__acciones">
        <button type="button" class="boton boton--chico boton--icono" data-editar-palabra="${item.id}" aria-label="Editar ${item.palabra}">
          <span class="icono-mask icono-mask--pencil" aria-hidden="true"></span>
        </button>
        <button type="button" class="boton boton--chico boton--icono boton--peligro" data-eliminar-palabra="${item.id}" aria-label="Eliminar ${item.palabra}">
          <span class="icono-mask icono-mask--trash" aria-hidden="true"></span>
        </button>
      </td>
    </tr>
  `).join('');

  if (window.lucide) window.lucide.createIcons();
}

export function renderizarPaginacionPalabras(total, paginaActual, porPagina) {
  const contenedor = document.querySelector('[data-paginacion-palabras]');
  if (!contenedor) return;

  const totalPaginas = Math.max(1, Math.ceil(total / porPagina));
  if (totalPaginas === 1) {
    contenedor.innerHTML = '';
    return;
  }

  const paginas = [...new Set([1, paginaActual - 1, paginaActual, paginaActual + 1, totalPaginas])]
    .filter(numero => numero >= 1 && numero <= totalPaginas)
    .sort((a, b) => a - b);

  let botones = `<button type="button" class="boton boton--chico paginacion__boton" data-pagina-palabras="${paginaActual - 1}" ${paginaActual === 1 ? 'disabled' : ''} aria-label="Página anterior">Anterior</button>`;
  paginas.forEach((numero, indice) => {
    if (indice > 0 && numero - paginas[indice - 1] > 1) botones += '<span class="paginacion__separador" aria-hidden="true">…</span>';
    botones += `<button type="button" class="boton boton--chico paginacion__boton" data-pagina-palabras="${numero}" ${numero === paginaActual ? 'aria-current="page"' : ''}>${numero}</button>`;
  });
  botones += `<button type="button" class="boton boton--chico paginacion__boton" data-pagina-palabras="${paginaActual + 1}" ${paginaActual === totalPaginas ? 'disabled' : ''} aria-label="Página siguiente">Siguiente</button>`;
  contenedor.innerHTML = botones;
}
