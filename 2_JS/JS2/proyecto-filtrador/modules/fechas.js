// formatea una fecha como dd/mm/aa para mostrarla en pantalla
export function formatearFecha(fecha = new Date()) {
  return new Intl.DateTimeFormat("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit"
  }).format(fecha);
}

// crea una marca simple para nombres de archivos
export function crearMarcaArchivo(fecha = new Date()) {
  return [
    fecha.getFullYear(),
    String(fecha.getMonth() + 1).padStart(2, "0"),
    String(fecha.getDate()).padStart(2, "0"),
    String(fecha.getHours()).padStart(2, "0"),
    String(fecha.getMinutes()).padStart(2, "0"),
    String(fecha.getSeconds()).padStart(2, "0")
  ].join("");
}
