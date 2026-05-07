const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const userController = require('./controllers/userController');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// configuracion basica del server
app.use(cors());
app.use(express.json()); // para que entienda json
app.use(express.urlencoded({ extended: true })); // para los datos del form
app.use(express.static(path.join(__dirname, 'public')));

// las rutas de la api
app.post('/api/users', userController.registerUser);

// prendemos el server en el puerto que toque
app.listen(PORT, () => {
  console.log(`Servidor de JS1 corriendo en el puerto http://localhost:${PORT}`);
});
