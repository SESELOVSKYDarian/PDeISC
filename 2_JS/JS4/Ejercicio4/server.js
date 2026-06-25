import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = 3003;

const alumnos = [
  { id: 1, nombre: "Alexis Vallejos", curso: "7mo 4ta", email: "alexis.vallejos@escuela.dev" },
  { id: 2, nombre: "Mateo Cecchini", curso: "7mo 4ta", email: "mateo.cecchini@escuela.dev" },
  { id: 3, nombre: "Sara Willers", curso: "6to 4ta", email: "sara.willers@escuela.dev" },
  { id: 4, nombre: "Nacho Torres", curso: "5to 6ta", email: "nacho.torres@escuela.dev" },
  { id: 5, nombre: "Malena Salvia", curso: "3ro 2da", email: "malena.salvia@escuela.dev" }
];

app.use(express.static(__dirname));

app.get("/", (_req, res) => {
  res.sendFile(path.join(__dirname, "pages", "index.html"));
});

app.get("/api/alumnos", (_req, res) => {
  res.json(alumnos);
});

app.listen(PORT, () => {
  console.log(`Ejercicio 4 escuchando en http://localhost:${PORT}`);
});
