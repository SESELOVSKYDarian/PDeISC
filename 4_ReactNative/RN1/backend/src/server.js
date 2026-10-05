import https from "node:https";
import { initDatabase } from "../database/init.js";
import { crearApi, crearCallback } from "./app.js";
import { config } from "./config.js";
import { credencialesHttps } from "./oauth/https.js";

try {
  await initDatabase(); // crea base, tablas y seed si faltan
} catch (error) {
  console.error(`No pude conectar a MySQL (${config.db.host}:${config.db.port}). ¿Está encendido XAMPP?`);
  console.error(error.message);
  process.exit(1);
}

crearApi().listen(config.port, () => console.log(`API DePaso en http://localhost:${config.port}`));

const retorno = crearCallback();
retorno.listen(config.callbackPort, () => console.log(`Retorno OAuth (web) en http://localhost:${config.callbackPort}`));

// sin ngrok: retorno para el celular con https propio en el dominio nip.io
if (!process.env.OAUTH_MOVIL_BASE && config.movilDominio) {
  const credenciales = await credencialesHttps(config.movilDominio);
  https.createServer(credenciales, retorno).listen(config.movilPort, () => {
    console.log(`Retorno OAuth (celular) en ${config.movilBase}`);
    console.log("URL a registrar en cada red para el celular:");
    for (const red of ["google", "discord", "facebook"]) {
      console.log(`  ${config.movilBase}/auth/${red}/callback`);
    }
  });
}

if (process.env.OAUTH_MOVIL_BASE) {
  console.log(`Retorno OAuth (celular) por ngrok: ${config.movilBase}  (ngrok http 5175 debe estar corriendo)`);
  console.log("URL a registrar en cada red para el celular:");
  for (const red of ["google", "discord", "facebook"]) {
    console.log(`  ${config.movilBase}/auth/${red}/callback`);
  }
}
