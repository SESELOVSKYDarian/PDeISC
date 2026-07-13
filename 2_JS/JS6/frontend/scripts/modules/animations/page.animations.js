// anima la entrada general de una pagina apenas termina de cargar
export function animarEntradaPagina() {
  const main = document.querySelector('main');
  if (main) {
    main.classList.add('animar-entrada');
  }
}
