const express = require('express');
const app = express();
const PORT = process.env.PORT || 3003;

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(PORT, () => {
    console.log(`Servidor para Ejercicio 3 (unshift) corriendo en http://localhost:${PORT}`);
});
