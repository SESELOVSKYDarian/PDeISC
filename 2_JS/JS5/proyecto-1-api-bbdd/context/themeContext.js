const CLAVE_TEMA = "tema-alumnosdb";

export function obtenerTemaGuardado() {
  return localStorage.getItem(CLAVE_TEMA) || "light";
}

export function guardarTema(tema) {
  localStorage.setItem(CLAVE_TEMA, tema);
}

