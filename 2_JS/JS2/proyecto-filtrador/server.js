import express from "express";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { crearMarcaArchivo, formatearFecha } from "./modules/fechas.js";
import {
  crearContenidoResultado,
  crearMensajeRepetidos,
  filtrarNumeros,
  leerNumerosDesdeTexto,
  obtenerRepetidos,
  sonNumerosValidos,
  validarContenidoEditable
} from "./modules/numeros.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = 3001;
const UPLOADS_DIR = path.join(__dirname, "data", "uploads");
const RESULTADOS_DIR = path.join(__dirname, "data", "resultados");
const LOCAL_DIR = path.join(__dirname, "data", "local");
const GENERADOR_DIR = path.join(__dirname, "..", "proyecto-generador", "data", "txt");

app.use(express.json());
app.use(express.raw({ type: "multipart/form-data", limit: "1mb" }));

// Log de peticiones para depuracion
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Rutas de API primero
app.get("/api/archivos", async (req, res) => {
  const uploads = await listarDesdeCarpeta(UPLOADS_DIR, "Subido");
  const resultados = await listarDesdeCarpeta(RESULTADOS_DIR, "Resultado");

  let generados = [];
  try {
    generados = await listarDesdeCarpeta(GENERADOR_DIR, "Generado");
  } catch (err) {
    console.log("No se pudo acceder a la carpeta del generador:", err.message);
  }

  res.json({ ok: true, archivos: [...uploads, ...generados, ...resultados] });
});

app.get("/api/archivos/:nombre", async (req, res) => {
  const archivo = await buscarArchivo(req.params.nombre);
  if (!archivo) return res.status(404).json({ ok: false, error: "Archivo no encontrado." });

  const stats = await fs.stat(archivo);
  const contenido = await fs.readFile(archivo, "utf8");
  res.json({ ok: true, archivo: { nombre: req.params.nombre, fechaCreacion: formatearFecha(stats.birthtime), contenido } });
});

app.post("/api/upload", async (req, res) => {
  const archivo = leerMultipart(req);
  if (!archivo) return res.status(400).json({ ok: false, error: "Debe subir un archivo TXT." });
  if (!validarNombreArchivo(archivo.nombre)) return res.status(400).json({ ok: false, error: "El archivo debe ser .txt y tener nombre valido." });

  const numeros = leerNumerosDesdeTexto(archivo.contenido);
  if (!sonNumerosValidos(numeros)) return res.status(400).json({ ok: false, error: "El TXT debe contener numeros validos. Para dividir números sólo usa salto de línea." });

  const repetidos = obtenerRepetidos(numeros);
  if (repetidos.cantidad > 0) {
    return res.status(400).json({ ok: false, error: crearMensajeRepetidos(repetidos), repetidos });
  }

  const nombreSeguro = `upload_${crearMarcaArchivo()}_${archivo.nombre}`;
  const contenido = numeros.join("\n");
  await fs.writeFile(path.join(UPLOADS_DIR, nombreSeguro), contenido, "utf8");
  await fs.writeFile(path.join(LOCAL_DIR, nombreSeguro), contenido, "utf8");
  res.status(201).json({
    ok: true,
    archivo: {
      nombre: nombreSeguro,
      contenido,
      fechaCreacion: formatearFecha(),
      almacenamiento: {
        servidor: path.join("data", "uploads", nombreSeguro),
        local: path.join("data", "local", nombreSeguro)
      }
    },
    numeros,
    repetidos
  });
});

app.post("/api/filtrar", async (req, res) => {
  const numeros = req.body?.numeros;
  if (!sonNumerosValidos(numeros)) return res.status(400).json({ ok: false, error: "Debe enviar un array con numeros validos." });

  const repetidos = obtenerRepetidos(numeros);
  if (repetidos.cantidad > 0) {
    return res.status(400).json({ ok: false, error: crearMensajeRepetidos(repetidos), repetidos });
  }

  const resultado = filtrarNumeros(numeros);
  const nombre = `resultado_${crearMarcaArchivo()}.txt`;
  const contenido = crearContenidoResultado(resultado);
  await fs.writeFile(path.join(RESULTADOS_DIR, nombre), contenido, "utf8");
  await fs.writeFile(path.join(LOCAL_DIR, nombre), contenido, "utf8");
  res.status(201).json({
    ok: true,
    resultado,
    archivo: {
      nombre,
      contenido,
      fechaCreacion: formatearFecha(),
      almacenamiento: {
        servidor: path.join("data", "resultados", nombre),
        local: path.join("data", "local", nombre)
      }
    }
  });
});

app.put("/api/archivos/:nombre", async (req, res) => {
  const archivo = await buscarArchivo(req.params.nombre);
  if (!archivo) return res.status(404).json({ ok: false, error: "Archivo no encontrado." });

  const esUpload = path.dirname(archivo) === UPLOADS_DIR;
  if (esUpload) {
    const numeros = leerNumerosDesdeTexto(req.body?.contenido);
    if (!sonNumerosValidos(numeros)) return res.status(400).json({ ok: false, error: "El TXT subido solo puede contener numeros validos." });

    const repetidos = obtenerRepetidos(numeros);
    if (repetidos.cantidad > 0) {
      return res.status(400).json({ ok: false, error: crearMensajeRepetidos(repetidos), repetidos });
    }
  }

  const validacion = validarContenidoEditable(req.body?.contenido);
  if (!validacion.ok) return res.status(400).json({ ok: false, error: validacion.error });

  const contenido = validacion.contenido;
  await fs.writeFile(archivo, contenido, "utf8");
  await fs.writeFile(path.join(LOCAL_DIR, req.params.nombre), contenido, "utf8");
  res.json({ ok: true, archivo: { nombre: req.params.nombre, contenido } });
});

app.delete("/api/archivos/:nombre", async (req, res) => {
  const archivo = await buscarArchivo(req.params.nombre);
  if (!archivo) return res.status(404).json({ ok: false, error: "Archivo no encontrado." });

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
  const archivo = await buscarArchivo(req.params.nombre);
  if (!archivo) return res.status(404).json({ ok: false, error: "Archivo no encontrado." });
  res.download(archivo, req.params.nombre);
});

// Archivos estaticos despues de las rutas de API
app.use(express.static(__dirname));

// crea las carpetas necesarias si todavia no existen
async function prepararCarpetas() {
  await fs.mkdir(UPLOADS_DIR, { recursive: true });
  await fs.mkdir(RESULTADOS_DIR, { recursive: true });
  await fs.mkdir(LOCAL_DIR, { recursive: true });
}

// valida nombres para evitar path traversal
function validarNombreArchivo(nombre) {
  return typeof nombre === "string" && /^[a-zA-Z0-9._-]+\.txt$/.test(nombre);
}

// busca un archivo por nombre en uploads o resultados
async function buscarArchivo(nombre) {
  if (!validarNombreArchivo(nombre)) return null;

  const rutas = [path.join(UPLOADS_DIR, nombre), path.join(RESULTADOS_DIR, nombre), path.join(GENERADOR_DIR, nombre)];
  for (const ruta of rutas) {
    try {
      await fs.access(ruta);
      return ruta;
    } catch {
      continue;
    }
  }

  return null;
}

// lista los txt reales de una carpeta
async function listarDesdeCarpeta(carpeta, tipo) {
  const archivos = await fs.readdir(carpeta);
  const txt = archivos.filter((archivo) => archivo.endsWith(".txt"));

  return Promise.all(
    txt.map(async (nombre) => {
      const stats = await fs.stat(path.join(carpeta, nombre));
      return { nombre, tipo, fechaCreacion: formatearFecha(stats.birthtime), bytes: stats.size };
    })
  );
}

// extrae el archivo txt de un formdata simple sin dependencias externas
function leerMultipart(req) {
  const tipo = req.headers["content-type"] || "";
  const limite = tipo.match(/boundary=(.+)$/)?.[1];
  if (!limite || !Buffer.isBuffer(req.body)) return null;

  const cuerpo = req.body.toString("utf8");
  const partes = cuerpo.split(`--${limite}`);
  const parteArchivo = partes.find((parte) => parte.includes('name="archivo"'));
  if (!parteArchivo) return null;

  const nombre = parteArchivo.match(/filename="([^"]+)"/)?.[1] || "";
  const contenido = parteArchivo.split("\r\n\r\n").slice(1).join("\r\n\r\n").replace(/\r\n--$/, "").trim();
  return { nombre: path.basename(nombre), contenido };
}

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "pages", "index.html"));
});


app.use((req, res) => {
  res.status(404).json({ ok: false, error: "Ruta no encontrada." });
});

prepararCarpetas().then(() => {
  app.listen(PORT, () => {
    console.log(`Proyecto filtrador activo en http://localhost:${PORT}`);
  });
});
