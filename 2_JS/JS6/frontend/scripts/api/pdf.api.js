// la descarga de PDF siempre se hace con POST + Blob, nunca con un link directo (eso seria GET)
import { API_BASE_URL } from '../config/api.config.js';

async function descargarBlobComoArchivo(respuesta, nombreArchivo) {
  if (!respuesta.ok) {
    throw new Error('No se pudo generar el PDF solicitado.');
  }
  const blob = await respuesta.blob();
  const url = window.URL.createObjectURL(blob);

  const enlaceTemporal = document.createElement('a');
  enlaceTemporal.href = url;
  enlaceTemporal.download = nombreArchivo;
  document.body.appendChild(enlaceTemporal);
  enlaceTemporal.click();
  document.body.removeChild(enlaceTemporal);

  // libero la memoria del objeto URL una vez que ya se disparó la descarga
  window.URL.revokeObjectURL(url);
}

export const PdfApi = {
  async descargarScoreActual(datosPartida) {
    const respuesta = await fetch(`${API_BASE_URL}/pdf/score-actual`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datosPartida)
    });
    await descargarBlobComoArchivo(respuesta, 'comprobante-partida.pdf');
  },

  async descargarRanking() {
    const respuesta = await fetch(`${API_BASE_URL}/pdf/ranking`, { method: 'POST' });
    await descargarBlobComoArchivo(respuesta, 'ranking.pdf');
  }
};
