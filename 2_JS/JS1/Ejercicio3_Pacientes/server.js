const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const patientController = require('./controllers/patientController');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3003;

// configuramos el server con lo de siempre
app.use(cors());
app.use(express.json()); // para los json
app.use(express.urlencoded({ extended: true })); // para los forms
app.use(express.static(path.join(__dirname, 'public'))); // archivos estaticos

app.post('/api/pacientes', patientController.registerPatient);

app.listen(PORT, () => {
  console.log(`Servidor de Registro de Pacientes corriendo en http://localhost:${PORT}`);
});
