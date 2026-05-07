const express = require('express');
const app = express();
const PORT = process.env.PORT || 3004;

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(PORT, () => {
    console.log(`Servidor para Ejercicio 4 (shift) corriendo en http://localhost:${PORT}`);
});
