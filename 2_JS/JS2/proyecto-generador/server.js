import express from "express";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { crearMarcaArchivo, formatearFecha } from "./modules/fechas.js";
import { crearContenidoTxt, sonNumerosValidos, validarCantidad, validarContenidoTxt, validarSinRepetidos } from "./modules/numeros.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = 3000;
const TXT_DIR = path.join(__dirname, "data", "txt");
const LOCAL_DIR = path.join(__dirname, "data", "local");

app.use(express.json());

// Log de peticiones para depuracion
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Rutas de API primero
app.get("/api/archivos", async (req, res) => {
  const archivos = await listarTxt();
  res.json({ ok: true, archivos });
});

app.get("/api/archivos/:nombre", async (req, res) => {
  const archivo = rutaTxt(req.params.nombre);
  if (!archivo) return res.status(400).json({ ok: false, error: "Nombre de archivo invalido." });

  try {
    const stats = await fs.stat(archivo);
    const contenido = await fs.readFile(archivo, "utf8");
    res.json({ ok: true, archivo: { nombre: req.params.nombre, fechaCreacion: formatearFecha(stats.birthtime), contenido } });
  } catch {
    res.status(404).json({ ok: false, error: "Archivo no encontrado." });
  }
});

app.post("/api/archivos", async (req, res) => {
  const numeros = req.body?.numeros;

  if (!sonNumerosValidos(numeros)) {
    return res.status(400).json({ ok: false, error: "Todos los valores deben ser numeros." });
  }

  const errorCantidad = validarCantidad(numeros);
  if (errorCantidad) {
    return res.status(400).json({ ok: false, error: errorCantidad });
  }

  const errorRepetidos = validarSinRepetidos(numeros);
  if (errorRepetidos) {
    return res.status(400).json({ ok: false, error: errorRepetidos });
  }

  const nombre = `numeros_${crearMarcaArchivo()}.txt`;
  const contenido = crearContenidoTxt(numeros);
  await fs.writeFile(path.join(TXT_DIR, nombre), contenido, "utf8");
  await fs.writeFile(path.join(LOCAL_DIR, nombre), contenido, "utf8");
  res.status(201).json({
    ok: true,
    archivo: {
      nombre,
      contenido,
      fechaCreacion: formatearFecha(),
      almacenamiento: {
        servidor: path.join("data", "txt", nombre),
        local: path.join("data", "local", nombre)
      }
    }
  });
});

app.put("/api/archivos/:nombre", async (req, res) => {
  const archivo = rutaTxt(req.params.nombre);
  if (!archivo) return res.status(400).json({ ok: false, error: "Nombre de archivo invalido." });

  const validacion = validarContenidoTxt(req.body?.contenido);
  if (!validacion.ok) {
    return res.status(400).json({ ok: false, error: validacion.error });
  }

  try {
    await fs.access(archivo);
    const contenido = crearContenidoTxt(validacion.numeros);
    await fs.writeFile(archivo, contenido, "utf8");
    await fs.writeFile(path.join(LOCAL_DIR, req.params.nombre), contenido, "utf8");
    res.json({ ok: true, archivo: { nombre: req.params.nombre, contenido } });
  } catch {
    res.status(404).json({ ok: false, error: "Archivo no encontrado." });
  }
});

app.delete("/api/archivos/:nombre", async (req, res) => {
  const archivo = rutaTxt(req.params.nombre);
  if (!archivo) return res.status(400).json({ ok: false, error: "Nombre de archivo invalido." });

  try {
    await fs.unlink(archivo);
    const rutaLocal = path.join(LOCAL_DIR, req.params.nombre);
    try {
      await fs.access(rutaLocal);
      await fs.unlink(rutaLocal);
    } catch {
      // no importa si el local no existe
    }
    res.json({ ok: true, mensaje: "Archivo eliminado correctamente." });
  } catch (error) {
    res.status(500).json({ ok: false, error: "No se pudo eliminar el archivo." });
  }
});

app.get("/api/archivos/:nombre/descargar", async (req, res) => {
  const archivo = rutaTxt(req.params.nombre);
  if (!archivo) return res.status(400).json({ ok: false, error: "Nombre de archivo invalido." });

  try {
    await fs.access(archivo);
    res.download(archivo, req.params.nombre);
  } catch {
    res.status(404).json({ ok: false, error: "Archivo no encontrado." });
  }
});

// Archivos estaticos despues de las rutas de API
app.use(express.static(__dirname));

// asegura que la carpeta de txt exista antes de usarla
async function prepararCarpetas() {
  await fs.mkdir(TXT_DIR, { recursive: true });
  await fs.mkdir(LOCAL_DIR, { recursive: true });
}

// evita nombres peligrosos y path traversal
function validarNombreArchivo(nombre) {
  return typeof nombre === "string" && /^[a-zA-Z0-9._-]+\.txt$/.test(nombre);
}

// resuelve un archivo dentro de la carpeta segura
function rutaTxt(nombre) {
  if (!validarNombreArchivo(nombre)) return null;
  return path.join(TXT_DIR, nombre);
}

// lista los archivos reales guardados en disco
async function listarTxt() {
  const archivos = await fs.readdir(TXT_DIR);
  const txt = archivos.filter((archivo) => archivo.endsWith(".txt"));

  return Promise.all(
    txt.map(async (nombre) => {
      const stats = await fs.stat(path.join(TXT_DIR, nombre));
      return {
        nombre,
        fechaCreacion: formatearFecha(stats.birthtime),
        bytes: stats.size
      };
    })
  );
}

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "pages", "index.html"));
});


app.use((req, res) => {
  res.status(404).json({ ok: false, error: "Ruta no encontrada." });
});

prepararCarpetas().then(() => {
  app.listen(PORT, () => {
    console.log(`Proyecto generador activo en http://localhost:${PORT}`);
  });
});
