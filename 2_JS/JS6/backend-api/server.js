// punto de entrada del backend: acá armo el servidor y conecto todas las rutas
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';

import { ENV } from './config/environment.js';
import { verificarConexion } from './config/database.js';
import { errorHandler, rutaNoEncontrada } from './middlewares/errorHandler.js';
import { LIMITE_JSON } from './utils/constantes.js';

import palabrasRoutes from './routes/palabras.routes.js';
import scoreRoutes from './routes/score.routes.js';
import estadisticasRoutes from './routes/estadisticas.routes.js';
import pdfRoutes from './routes/pdf.routes.js';
import authRoutes from './routes/auth.routes.js';

const app = express();

// seguridad basica de cabeceras HTTP
app.use(helmet());

// habilito CORS solo para el origen configurado del frontend
app.use(cors({ origin: ENV.CORS_ORIGIN === '*' ? true : ENV.CORS_ORIGIN, credentials: true }));

// limito el tamaño del JSON para evitar payloads gigantes
app.use(express.json({ limit: LIMITE_JSON }));
app.use(cookieParser());

// ruta principal: permite comprobar desde el navegador que la API está disponible
app.get('/', (req, res) => {
  res.json({ ok: true, mensaje: 'API de El Ahorcado funcionando correctamente.' });
});

// ruta simple para chequear que el server esta vivo (no cuenta como endpoint de datos)
app.get('/api/estado', (req, res) => {
  res.json({ ok: true, mensaje: 'API de El Ahorcado funcionando correctamente.' });
});

// conecto todos los grupos de rutas
app.use('/api/palabras', palabrasRoutes);
app.use('/api/score', scoreRoutes);
app.use('/api/estadisticas', estadisticasRoutes);
app.use('/api/pdf', pdfRoutes);
app.use('/api/auth', authRoutes);

// si ninguna ruta respondio, es un 404
app.use(rutaNoEncontrada);

// manejador centralizado de errores, siempre al final
app.use(errorHandler);

app.listen(ENV.PORT, async () => {
  console.log(`🎮 Servidor de El Ahorcado corriendo en http://localhost:${ENV.PORT}`);
  await verificarConexion();
});
