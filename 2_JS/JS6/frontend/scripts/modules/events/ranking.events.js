// Conecta el ranking publico de solo lectura con busqueda, orden, paginacion y PDF.
import { ScoreApi } from '../../api/score.api.js';
import { PdfApi } from '../../api/pdf.api.js';
import { renderizarTablaRanking, renderizarPaginacion } from '../render/ranking.render.js';
import { leerFiltrosRanking } from '../ranking/filtros.ranking.js';
import { alternarOrden, obtenerOrdenActual } from '../ranking/ordenamiento.ranking.js';
import { irAPagina, reiniciarPagina, obtenerPaginaActual, obtenerPorPagina } from '../ranking/paginacion.ranking.js';
import { mostrarToast } from '../ui/toast.js';
import { debounce } from '../../utils/helpers.js';
import { activarCargaBoton, desactivarCargaBoton } from '../ui/loader.js';

export function inicializarEventosRanking() {
  const tabla = document.querySelector('[data-cuerpo-tabla-ranking]');
  if (!tabla) return;

  cargarRanking();

  const buscador = document.querySelector('[data-buscador-ranking]');
  buscador?.addEventListener('input', debounce(() => {
    reiniciarPagina();
    cargarRanking();
  }, 350));

  document.querySelectorAll('[data-ordenar-por]').forEach(encabezado => {
    encabezado.addEventListener('click', () => {
      alternarOrden(encabezado.dataset.ordenarPor);
      cargarRanking();
    });
  });

  document.querySelector('[data-paginacion-ranking]')?.addEventListener('click', (evento) => {
    const boton = evento.target.closest('[data-pagina]');
    if (!boton) return;
    irAPagina(Number(boton.dataset.pagina));
    cargarRanking();
  });

  document.querySelector('[data-descargar-pdf-ranking]')?.addEventListener('click', async (evento) => {
    const boton = evento.currentTarget;
    activarCargaBoton(boton, 'Generando...');
    try {
      await PdfApi.descargarRanking();
      mostrarToast('PDF del ranking generado correctamente.', 'exito');
    } catch {
      mostrarToast('No se pudo generar el PDF del ranking.', 'error');
    } finally {
      desactivarCargaBoton(boton);
    }
  });
}

async function cargarRanking() {
  const contenedorTabla = document.querySelector('[data-cuerpo-tabla-ranking]');
  const { columna, direccion } = obtenerOrdenActual();

  try {
    const respuesta = await ScoreApi.listar({
      ...leerFiltrosRanking(),
      orden: columna,
      direccion,
      pagina: obtenerPaginaActual(),
      porPagina: obtenerPorPagina()
    });

    renderizarTablaRanking(respuesta.datos.scores);
    renderizarPaginacion(respuesta.datos.total, obtenerPaginaActual(), obtenerPorPagina());
  } catch {
    if (contenedorTabla) contenedorTabla.innerHTML = '<tr><td colspan="4">No se pudo cargar el ranking.</td></tr>';
  }
}
