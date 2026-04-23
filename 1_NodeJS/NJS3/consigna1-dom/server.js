import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const server = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = process.env.PORT || 3001;

// server simple para levantar la consigna
server.use('/public', express.static(path.join(__dirname, 'public')));
server.use('/media', express.static(path.join(__dirname, 'media')));

server.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'pages', 'index.html'));
});

server.listen(PORT, () => {
  console.log(`Consigna 1 lista en http://localhost:${PORT}`);
});
