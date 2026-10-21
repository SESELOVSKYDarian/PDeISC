// numero con coma decimal, como se escribe en Argentina
export function decimales(valor: number | null | undefined, cantidad = 2): string {
  if (valor === null || valor === undefined || Number.isNaN(valor)) return "–";
  return valor.toFixed(cantidad).replace(".", ",");
}

export function mbOGb(bytes: number | null): string {
  if (!bytes) return "–";
  const gb = bytes / 1024 ** 3;
  return gb >= 1 ? `${decimales(gb, 1)} GB` : `${decimales(bytes / 1024 ** 2, 0)} MB`;
}

export function tamanoArchivo(bytes: number | undefined): string {
  if (!bytes) return "–";
  if (bytes >= 1024 ** 2) return `${decimales(bytes / 1024 ** 2, 1)} MB`;
  return `${decimales(bytes / 1024, 0)} KB`;
}

export function entre(valor: number, minimo: number, maximo: number): number {
  return Math.min(maximo, Math.max(minimo, valor));
}
