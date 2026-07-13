// formateo simple de fechas para mostrar en PDFs y respuestas

export function formatearFechaCorta(fecha) {
  const d = new Date(fecha);
  const dia = String(d.getDate()).padStart(2, '0');
  const mes = String(d.getMonth() + 1).padStart(2, '0');
  const anio = String(d.getFullYear()).slice(-2);
  return `${dia}/${mes}/${anio}`;
}

export function fechaGeneracionPdf() {
  const ahora = new Date();
  return ahora.toLocaleString('es-AR');
}
