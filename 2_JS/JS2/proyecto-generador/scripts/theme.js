import { aplicarTema, guardarTema, obtenerTema } from "../context/themeContext.js";

// actualiza el texto del boton segun el tema actual
function actualizarBotonPrincipal(boton, tema) {
  const icono = tema === "dark" ? "sun" : "moon";
  const texto = tema === "dark" ? "Modo claro" : "Modo oscuro";
  boton.innerHTML = `<i data-lucide="${icono}" aria-hidden="true"></i><span>${texto}</span>`;

  if (window.lucide) {
    window.lucide.createIcons();
  }
}

// actualiza el boton flotante con solo icono
function actualizarBotonFlotante(boton, tema) {
  const icono = tema === "dark" ? "sun" : "moon";
  boton.innerHTML = `<i data-lucide="${icono}" aria-hidden="true"></i>`;

  if (window.lucide) {
    window.lucide.createIcons();
  }
}

// decide si el boton flotante de tema debe mostrarse
function actualizarVisibilidadFlotante(botonPrincipal, botonFlotante) {
  const esPantallaMediaOChica = window.matchMedia("(max-width: 991px)").matches;
  if (esPantallaMediaOChica) {
    botonFlotante.hidden = false;
    return;
  }

  const rect = botonPrincipal.getBoundingClientRect();
  const estaVisible = rect.bottom > 0 && rect.top < window.innerHeight;
  const hayScroll = window.scrollY > 140;
  botonFlotante.hidden = estaVisible || !hayScroll;
}

// inicia el cambio de tema desde el boton
export function iniciarTema() {
  const boton = document.querySelector("#themeButton");
  const botonFlotante = document.querySelector("#floatingThemeButton");
  let tema = obtenerTema();
  aplicarTema(tema);
  actualizarBotonPrincipal(boton, tema);
  actualizarBotonFlotante(botonFlotante, tema);

  const cambiarTema = () => {
    tema = tema === "dark" ? "light" : "dark";
    guardarTema(tema);
    aplicarTema(tema);
    actualizarBotonPrincipal(boton, tema);
    actualizarBotonFlotante(botonFlotante, tema);
  };

  boton.addEventListener("click", cambiarTema);
  botonFlotante.addEventListener("click", cambiarTema);
  window.addEventListener("scroll", () => actualizarVisibilidadFlotante(boton, botonFlotante));
  window.addEventListener("resize", () => actualizarVisibilidadFlotante(boton, botonFlotante));
  actualizarVisibilidadFlotante(boton, botonFlotante);
}
