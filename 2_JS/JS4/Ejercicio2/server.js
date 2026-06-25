import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = 3001;

app.use(express.json());
app.use(express.static(__dirname));

function validateUser(req, res, next) {
  const { name, email } = req.body;
  const errors = {};

  if (typeof name !== "string" || name.trim().length < 3 || name.trim().length > 40) {
    errors.name = "El nombre debe tener entre 3 y 40 caracteres.";
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (
    typeof email !== "string" ||
    email.trim().length < 6 ||
    email.trim().length > 80 ||
    !emailPattern.test(email.trim())
  ) {
    errors.email = "El email debe tener un formato valido.";
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      ok: false,
      errors
    });
  }

  next();
}

app.get("/", (_req, res) => {
  res.sendFile(path.join(__dirname, "pages", "index.html"));
});

app.post("/api/validar-usuario", validateUser, (req, res) => {
  res.json({
    ok: true,
    message: "Datos validados correctamente.",
    user: {
      name: req.body.name.trim(),
      email: req.body.email.trim().toLowerCase()
    }
  });
});

app.listen(PORT, () => {
  console.log(`Ejercicio 2 escuchando en http://localhost:${PORT}`);
});
