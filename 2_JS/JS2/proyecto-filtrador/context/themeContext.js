const CLAVE_TEMA = "tema-filtrador";

// lee el tema guardado o usa claro por defecto
export function obtenerTema() {
  return localStorage.getItem(CLAVE_TEMA) || "light";
}

// guarda el tema elegido por el usuario
export function guardarTema(tema) {
  localStorage.setItem(CLAVE_TEMA, tema);
}

// aplica la hoja de estilos correspondiente
export function aplicarTema(tema) {
  const linkTema = document.querySelector("#themeStylesheet");
  linkTema.setAttribute("href", `/styles/${tema}.css`);
  document.documentElement.dataset.theme = tema;
}
