const CLAVE_TEMA = "tema-generador";

// lee el tema guardado o devuelve claro como opcion inicial
export function obtenerTema() {
  return localStorage.getItem(CLAVE_TEMA) || "light";
}

// guarda la preferencia actual del usuario
export function guardarTema(tema) {
  localStorage.setItem(CLAVE_TEMA, tema);
}

// cambia la hoja de estilos activa segun el tema elegido
export function aplicarTema(tema) {
  const linkTema = document.querySelector("#themeStylesheet");
  linkTema.setAttribute("href", `/styles/${tema}.css`);
  document.documentElement.dataset.theme = tema;
}
