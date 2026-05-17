import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { getData as getEj01 } from "./modules/ejercicio01_push/server.js";
import { getData as getEj02 } from "./modules/ejercicio02_pop/server.js";
import { getData as getEj03 } from "./modules/ejercicio03_unshift/server.js";
import { getData as getEj04 } from "./modules/ejercicio04_shift/server.js";
import { getData as getEj05 } from "./modules/ejercicio05_splice/server.js";
import { getData as getEj06 } from "./modules/ejercicio06_slice/server.js";
import { getData as getEj07 } from "./modules/ejercicio07_indexOf/server.js";
import { getData as getEj08 } from "./modules/ejercicio08_includes/server.js";
import { getData as getEj09 } from "./modules/ejercicio09_forEach/server.js";
import { getData as getEj10 } from "./modules/ejercicio10_map/server.js";
import { getData as getEj11 } from "./modules/ejercicio11_filter/server.js";
import { getData as getEj12 } from "./modules/ejercicio12_reduce/server.js";
import { getData as getEj13 } from "./modules/ejercicio13_sort/server.js";
import { getData as getEj14 } from "./modules/ejercicio14_reverse/server.js";
import { getData as getEj15 } from "./modules/ejercicio15_secreto/server.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = 3000;

// Lista de ejercicios importados en el servidor principal.
function buildEjercicios() {
  const ejercicios = [
    getEj01(), getEj02(), getEj03(), getEj04(), getEj05(),
    getEj06(), getEj07(), getEj08(), getEj09(), getEj10(),
    getEj11(), getEj12(), getEj13(), getEj14(), getEj15()
  ];

  for (const ej of ejercicios) {
    if (!ej || typeof ej !== "object" || !Array.isArray(ej.casos) || !ej.metodo) {
      throw new Error("Modulo invalido detectado");
    }
  }

  return ejercicios;
}

// Devuelve content-type segun extension.
function getContentType(filePath) {
  const ext = path.extname(filePath);
  const map = {
    ".html": "text/html; charset=utf-8",
    ".js": "text/javascript; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".json": "application/json; charset=utf-8"
  };
  return map[ext] || "text/plain; charset=utf-8";
}

// Sirve archivos estaticos del proyecto.
function serveStatic(res, pathname) {
  const safePath = pathname === "/" ? "/pages/index.html" : pathname;
  const filePath = path.join(__dirname, safePath);

  if (!filePath.startsWith(__dirname)) {
    res.writeHead(403, { "Content-Type": "application/json; charset=utf-8" });
    res.end(JSON.stringify({ error: "Acceso denegado" }));
    return;
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { "Content-Type": "application/json; charset=utf-8" });
      res.end(JSON.stringify({ error: "Ruta no encontrada" }));
      return;
    }

    res.writeHead(200, { "Content-Type": getContentType(filePath) });
    res.end(data);
  });
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname;

  try {
    if (pathname === "/api/ejercicios") {
      const ejercicios = buildEjercicios();
      res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
      res.end(JSON.stringify({ total: ejercicios.length, ejercicios }));
      return;
    }

    if (pathname === "/api/secreto") {
      const secreto = getEj15();
      res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
      res.end(JSON.stringify({ entrada: secreto.entrada, salida: secreto.salida }));
      return;
    }

    if (["/", "/pages/index.html"].includes(pathname) || pathname.startsWith("/scripts/") || pathname.startsWith("/styles/") || pathname.startsWith("/Context/")) {
      serveStatic(res, pathname);
      return;
    }

    res.writeHead(404, { "Content-Type": "application/json; charset=utf-8" });
    res.end(JSON.stringify({ error: "Ruta no encontrada" }));
  } catch (error) {
    res.writeHead(500, { "Content-Type": "application/json; charset=utf-8" });
    res.end(JSON.stringify({ error: "Error interno", detalle: error.message }));
  }
});

server.listen(PORT, () => {
  console.log(`Servidor activo en http://localhost:${PORT}`);
});
