// paleta estilo iOS (system colors)
export interface Colores {
  fondo: string;
  superficie: string;
  texto: string;
  textoSecundario: string;
  separador: string;
  relleno: string;
  acento: string;
  exito: string;
  peligro: string;
  aviso: string;
}

export const claro: Colores = {
  fondo: "#F2F2F7",
  superficie: "#FFFFFF",
  texto: "#000000",
  textoSecundario: "#6C6C70",
  separador: "rgba(60,60,67,0.14)",
  relleno: "rgba(120,120,128,0.12)",
  acento: "#007AFF",
  exito: "#34C759",
  peligro: "#FF3B30",
  aviso: "#FF9500",
};

export const oscuro: Colores = {
  fondo: "#000000",
  superficie: "#1C1C1E",
  texto: "#FFFFFF",
  textoSecundario: "#9A9AA0",
  separador: "rgba(84,84,88,0.55)",
  relleno: "rgba(120,120,128,0.24)",
  acento: "#0A84FF",
  exito: "#30D158",
  peligro: "#FF453A",
  aviso: "#FF9F0A",
};
