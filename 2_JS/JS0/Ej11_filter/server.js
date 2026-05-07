const express = require('express');
const app = express();
const PORT = process.env.PORT || 3011;

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(PORT, () => {
    console.log(`Servidor para Ejercicio 11 (filter) corriendo en http://localhost:${PORT}`);
});
