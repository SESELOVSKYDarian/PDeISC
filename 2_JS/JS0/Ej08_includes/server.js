const express = require('express');
const app = express();
const PORT = process.env.PORT || 3008;

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(PORT, () => {
    console.log(`Servidor para Ejercicio 8 (includes) corriendo en http://localhost:${PORT}`);
});
