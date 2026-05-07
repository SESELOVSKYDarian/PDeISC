const express = require('express');
const app = express();
const PORT = process.env.PORT || 3006;

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(PORT, () => {
    console.log(`Servidor para Ejercicio 6 (slice) corriendo en http://localhost:${PORT}`);
});
