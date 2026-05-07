const express = require('express');
const app = express();
const PORT = process.env.PORT || 3007;

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(PORT, () => {
    console.log(`Servidor para Ejercicio 7 (indexOf) corriendo en http://localhost:${PORT}`);
});
