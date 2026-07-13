// conecta botones, buscador y tabla del panel admin con sus modulos correspondientes
import { cargarListadoPalabras, cambiarPaginaPalabras, abrirModalCrearPalabra, abrirModalEditarPalabra, confirmarEliminarPalabra } from '../admin/palabras.admin.js';
import { cargarDashboard } from '../admin/dashboard.admin.js';
import { inicializarScoresAdmin } from '../admin/scores.admin.js';
import { debounce } from '../../utils/helpers.js';

export function inicializarEventosAdmin() {
  const tablaPalabras = document.querySelector('[data-cuerpo-tabla-palabras]');
  if (!tablaPalabras) return; // esta pagina no es admin.html

  cargarDashboard();
  cargarListadoPalabras();
  inicializarScoresAdmin();

  document.querySelector('[data-abrir-crear-palabra]')?.addEventListener('click', abrirModalCrearPalabra);

  document.querySelector('[data-paginacion-palabras]')?.addEventListener('click', (evento) => {
    const boton = evento.target.closest('[data-pagina-palabras]');
    if (boton && !boton.disabled) cambiarPaginaPalabras(Number(boton.dataset.paginaPalabras));
  });

  tablaPalabras.addEventListener('click', (evento) => {
    const botonEditar = evento.target.closest('[data-editar-palabra]');
    const botonEliminar = evento.target.closest('[data-eliminar-palabra]');

    if (botonEditar) abrirModalEditarPalabra(Number(botonEditar.dataset.editarPalabra));
    if (botonEliminar) confirmarEliminarPalabra(Number(botonEliminar.dataset.eliminarPalabra));
  });

  const buscador = document.querySelector('[data-buscador-palabras]');
  buscador?.addEventListener('input', debounce((evento) => {
    cargarListadoPalabras({ busqueda: evento.target.value });
  }, 350));

  const filtroCategoria = document.querySelector('[data-filtro-categoria]');
  const filtroDificultad = document.querySelector('[data-filtro-dificultad]');

  const aplicarFiltros = () => cargarListadoPalabras({
    busqueda: buscador?.value || undefined,
    categoria: filtroCategoria?.value || undefined,
    dificultad: filtroDificultad?.value || undefined
  });

  filtroCategoria?.addEventListener('change', aplicarFiltros);
  filtroDificultad?.addEventListener('change', aplicarFiltros);
}
