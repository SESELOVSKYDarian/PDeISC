// genero los PDFs en memoria (buffer) para poder mandarlos directo por la respuesta HTTP
import PDFDocument from 'pdfkit';
import { fechaGeneracionPdf, formatearFechaCorta } from '../utils/fechas.js';

function crearDocumentoBase(titulo) {
  const doc = new PDFDocument({ margin: 50, size: 'A4' });

  doc.fontSize(20).fillColor('#111111').text(titulo, { align: 'center' });
  doc.moveDown(0.3);
  doc.fontSize(10).fillColor('#555555').text(`Generado el ${fechaGeneracionPdf()}`, { align: 'center' });
  doc.moveDown(1);
  doc.strokeColor('#111111').lineWidth(1.5)
    .moveTo(50, doc.y).lineTo(545, doc.y).stroke();
  doc.moveDown(1);

  return doc;
}

function agregarPieDePagina(doc) {
  const rango = doc.bufferedPageRange();
  for (let i = 0; i < rango.count; i++) {
    doc.switchToPage(i);
    doc.fontSize(8).fillColor('#888888').text(
      `El Ahorcado — Página ${i + 1} de ${rango.count}`,
      50, 780, { align: 'center', width: 495 }
    );
  }
}

export const PdfService = {
  // genera el comprobante de una partida puntual
  generarScoreActual({ nombre, puntos, tiempo, fecha, palabra, dificultad, resultado }) {
    const doc = crearDocumentoBase('Comprobante de Partida');

    const filas = [
      ['Nombre', nombre],
      ['Resultado', resultado],
      ['Palabra', palabra],
      ['Dificultad', dificultad],
      ['Puntos', String(puntos)],
      ['Tiempo (segundos)', String(tiempo)],
      ['Fecha', formatearFechaCorta(fecha || new Date())]
    ];

    doc.fontSize(12).fillColor('#111111');
    filas.forEach(([etiqueta, valor]) => {
      doc.font('Helvetica-Bold').text(`${etiqueta}: `, { continued: true });
      doc.font('Helvetica').text(String(valor));
      doc.moveDown(0.4);
    });

    agregarPieDePagina(doc);
    doc.end();
    return doc;
  },

  // genera el ranking completo en formato de tabla
  generarRanking(listaScores) {
    const doc = crearDocumentoBase('Ranking de Jugadores');

    const anchoColumnas = [40, 180, 100, 100, 95];
    const encabezados = ['#', 'Nombre', 'Puntos', 'Tiempo (s)', 'Fecha'];
    let y = doc.y;

    // dibujo el encabezado de la tabla
    doc.font('Helvetica-Bold').fontSize(11).fillColor('#ffffff');
    doc.rect(50, y, 495, 22).fill('#111111');
    doc.fillColor('#ffffff');
    let x = 50;
    encabezados.forEach((texto, i) => {
      doc.text(texto, x + 5, y + 6, { width: anchoColumnas[i] - 10 });
      x += anchoColumnas[i];
    });

    y += 22;

    doc.font('Helvetica').fontSize(10).fillColor('#111111');

    listaScores.forEach((item, indice) => {
      if (y > 760) {
        doc.addPage();
        y = 50;
      }

      const fondo = indice % 2 === 0 ? '#f2efe8' : '#ffffff';
      doc.rect(50, y, 495, 20).fill(fondo);
      doc.fillColor('#111111');

      x = 50;
      const fila = [
        String(indice + 1),
        item.nombre,
        String(item.puntos),
        String(item.tiempo),
        formatearFechaCorta(item.fecha)
      ];
      fila.forEach((texto, i) => {
        doc.text(texto, x + 5, y + 5, { width: anchoColumnas[i] - 10 });
        x += anchoColumnas[i];
      });

      y += 20;
    });

    agregarPieDePagina(doc);
    doc.end();
    return doc;
  }
};
