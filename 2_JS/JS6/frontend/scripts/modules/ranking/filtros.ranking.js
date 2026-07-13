// arma el objeto de filtros actuales del ranking, leyendo los controles del DOM
export function leerFiltrosRanking() {
  const buscador = document.querySelector('[data-buscador-ranking]');
  return {
    busqueda: buscador?.value || undefined
  };
}
