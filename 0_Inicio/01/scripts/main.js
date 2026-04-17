// cambia el icono del menu segun este abierto o cerrado
function actualizarIconoMenu(boton, abierto) {
  const icono = boton.querySelector("i");

  if (!icono || !window.lucide) {
    return;
  }

  icono.setAttribute("data-lucide", abierto ? "x" : "menu");
  window.lucide.createIcons();
}

function inicializarMenuMovil() {
  const nav = document.querySelector(".navegacion");
  const botonMenu = document.querySelector(".menu-movil-boton");

  if (!nav || !botonMenu) {
    return;
  }

  // abre o cierra el menu en mobile y cambia el icono
  botonMenu.addEventListener("click", () => {
    nav.classList.toggle("is-mobile-open");
    const menuAbierto = nav.classList.contains("is-mobile-open");
    actualizarIconoMenu(botonMenu, menuAbierto);
  });
}

function inicializarIconos() {
  // reemplaza los <i data-lucide=""> por iconos reales
  if (window.lucide) {
    window.lucide.createIcons();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  // espera a que el html este listo antes de ejecutar el resto
  inicializarMenuMovil();
  inicializarIconos();
});
