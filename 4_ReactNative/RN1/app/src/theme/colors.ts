export interface Colores {
  fondo: string;
  superficie: string;
  superficieAlt: string;
  borde: string;
  bordeControl: string; // bordes de inputs y botones (contraste 3:1)
  texto: string;
  textoSuave: string;
  acento: string;
  acentoTexto: string;
  error: string;
  errorFondo: string;
  panelMarca: string;
  panelMarcaTexto: string;
}

// paleta sacada del isotipo: azul noche, celeste y verde lima
export const claro: Colores = {
  fondo: "#F7F7F8",
  superficie: "#FFFFFF",
  superficieAlt: "#F0F1F6",
  borde: "#E1E4EE",
  bordeControl: "#8A8FA8",
  texto: "#1A1049",
  textoSuave: "#5E6482",
  acento: "#1A1049",
  acentoTexto: "#FFFFFF",
  error: "#B42318",
  errorFondo: "#FDECEA",
  panelMarca: "#1A1049",
  panelMarcaTexto: "#F2F1FA",
};

export const oscuro: Colores = {
  fondo: "#0D0A22",
  superficie: "#17133A",
  superficieAlt: "#211C4C",
  borde: "#2D2860",
  bordeControl: "#7D78B0",
  texto: "#F2F1FA",
  textoSuave: "#A9A6C9",
  acento: "#9BF500",
  acentoTexto: "#1A1049",
  error: "#FF8B7E",
  errorFondo: "#3A1D1A",
  panelMarca: "#120E33",
  panelMarcaTexto: "#F2F1FA",
};
