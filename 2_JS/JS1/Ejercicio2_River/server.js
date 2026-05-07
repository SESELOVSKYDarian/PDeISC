const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const socioController = require('./controllers/socioController');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;

// configuramos el server para river
app.use(cors());
app.use(express.json()); // para los json que mandamos
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public'))); // aca estan los archivos de la web

app.post('/api/socios', socioController.registerSocio);

app.listen(PORT, () => {
  console.log(`Servidor de Registro Socios River corriendo en el puerto http://localhost:${PORT}`);
});
