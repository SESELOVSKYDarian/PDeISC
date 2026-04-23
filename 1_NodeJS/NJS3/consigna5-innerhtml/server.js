/**
 * @file app.js
 * @description Servidor Express para la Consigna 5.
 * Sirve archivos estáticos y la página principal.
 */

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = process.env.PORT || 3005;

app.use('/public', express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'pages', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Consigna 5 lista en http://localhost:${PORT}`);
});
