// rumbo en grados (0 = norte) a partir del campo magnetico, con el celu apoyado plano
export function rumboDesdeCampo(x: number, y: number): number {
  const grados = (Math.atan2(y, x) * 180) / Math.PI - 90;
  return (grados + 360) % 360;
}

const PUNTOS = ["N", "NE", "E", "SE", "S", "SO", "O", "NO"];

export function puntoCardinal(grados: number): string {
  return PUNTOS[Math.round(grados / 45) % 8];
}

// devuelve un angulo equivalente a "nuevo" pero cercano a "previo", asi la aguja no da la vuelta larga
export function anguloContinuo(previo: number, nuevo: number): number {
  let delta = (nuevo - previo) % 360;
  if (delta > 180) delta -= 360;
  if (delta < -180) delta += 360;
  return previo + delta;
}
