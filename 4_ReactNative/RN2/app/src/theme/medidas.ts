// escala de espaciado (base 4) y radios
export const espacio = { xs: 4, s: 8, m: 16, l: 24, xl: 32, xxl: 48 };
export const radio = { s: 10, m: 14, l: 22, pill: 999 };
export const anchoMaximo = 640;

export const tipo = {
  tituloGrande: { fontSize: 34, fontWeight: "700" as const, letterSpacing: -0.6 },
  titulo: { fontSize: 22, fontWeight: "700" as const, letterSpacing: -0.3 },
  cuerpo: { fontSize: 17, fontWeight: "400" as const, letterSpacing: -0.2 },
  detalle: { fontSize: 15, fontWeight: "400" as const, letterSpacing: -0.1 },
  seccion: { fontSize: 13, fontWeight: "400" as const, letterSpacing: 0.2 },
  numero: { fontSize: 56, fontWeight: "700" as const, letterSpacing: -1.2 },
};
