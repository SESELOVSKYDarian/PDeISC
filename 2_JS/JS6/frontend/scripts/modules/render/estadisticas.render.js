// pinta las tarjetas de estadisticas del dashboard del admin
export function renderizarEstadisticas(datos) {
  const contenedor = document.querySelector('[data-dashboard-estadisticas]');
  if (!contenedor) return;

  contenedor.innerHTML = `
    <div class="tarjeta tarjeta-estadistica animar-entrada-escala">
      <div class="tarjeta-estadistica__numero">${datos.totalPalabras}</div>
      <div class="tarjeta-estadistica__etiqueta">Palabras totales</div>
    </div>
    <div class="tarjeta tarjeta-estadistica animar-entrada-escala">
      <div class="tarjeta-estadistica__numero">${datos.totalPartidas}</div>
      <div class="tarjeta-estadistica__etiqueta">Partidas jugadas</div>
    </div>
    <div class="tarjeta tarjeta-estadistica animar-entrada-escala">
      <div class="tarjeta-estadistica__numero">${datos.promedioPuntos}</div>
      <div class="tarjeta-estadistica__etiqueta">Promedio de puntos</div>
    </div>
    <div class="tarjeta tarjeta-estadistica animar-entrada-escala">
      <div class="tarjeta-estadistica__numero">${datos.mejorPuntaje ? datos.mejorPuntaje.puntos : '-'}</div>
      <div class="tarjeta-estadistica__etiqueta">Mejor puntaje ${datos.mejorPuntaje ? `(${datos.mejorPuntaje.nombre})` : ''}</div>
    </div>
  `;
}
