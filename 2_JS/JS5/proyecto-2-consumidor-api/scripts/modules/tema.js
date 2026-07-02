import { obtenerTemaGuardado, guardarTema } from "../../context/themeContext.js";

export function aplicarTema(tema, linkTema, botonTema) {
  linkTema.setAttribute("href", `/styles/${tema}.css`);

  const icono = tema === "dark" ? "sun" : "moon";
  const accion = tema === "dark" ? "Activar modo claro" : "Activar modo oscuro";

  botonTema.innerHTML = `<i data-lucide="${icono}"></i>`;
  botonTema.setAttribute("aria-label", accion);
  botonTema.setAttribute("title", accion);

  lucide.createIcons();
}

export function alternarTema(linkTema, botonTema) {
  const temaActual = obtenerTemaGuardado();
  const nuevoTema = temaActual === "dark" ? "light" : "dark";

  guardarTema(nuevoTema);
  aplicarTema(nuevoTema, linkTema, botonTema);

  return nuevoTema;
}

