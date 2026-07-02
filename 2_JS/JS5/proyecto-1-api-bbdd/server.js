import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import alumnosRoutes from "./routes/alumnos.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/styles", express.static(path.join(__dirname, "styles")));
app.use("/scripts", express.static(path.join(__dirname, "scripts")));
app.use("/context", express.static(path.join(__dirname, "context")));
app.use(express.static(path.join(__dirname, "pages")));

app.use("/api/alumnos", alumnosRoutes);

app.use((req, res) => {
  res.status(404).json({
    ok: false,
    mensaje: "Ruta no encontrada"
  });
});

app.listen(PORT, () => {
  console.log(`Proyecto 1 listo en http://localhost:${PORT}`);
});

