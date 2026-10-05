import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import { callback } from "./controllers/oauth.controller.js";
import apiRoutes from "./routes/api.routes.js";

// la app nativa no manda Origin; la web viene de localhost o la red local
const ORIGEN_OK = /^https?:\/\/(localhost|127\.0\.0\.1|\d{1,3}(\.\d{1,3}){3})(:\d+)?$/;

const origenPermitido = (origen, avisar) => avisar(null, !origen || ORIGEN_OK.test(origen));

// API principal (puerto 3001)
export function crearApi() {
  const app = express();
  app.use(helmet());
  app.use(cors({ origin: origenPermitido }));
  app.use(express.json({ limit: "10kb" }));
  app.use("/api", apiRoutes);
  app.use((req, res) => res.status(404).json({ ok: false, mensaje: "Ruta no encontrada" }));
  app.use((error, req, res, next) => {
    if (error.type === "entity.parse.failed") {
      return res.status(400).json({ ok: false, mensaje: "JSON inválido" });
    }
    console.error(error);
    res.status(500).json({ ok: false, mensaje: "Error interno del servidor" });
  });
  return app;
}

// recibe la vuelta de las redes (puerto 5175); sale por ngrok, así que lleva helmet y límite
export function crearCallback() {
  const app = express();
  app.set("trust proxy", 1); // ngrok va adelante: así el límite cuenta la IP real
  app.use(helmet());
  app.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 60 }));
  app.get("/auth/:proveedor/callback", callback);
  return app;
}
