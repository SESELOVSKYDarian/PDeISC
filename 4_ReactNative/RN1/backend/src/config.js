import "dotenv/config";
import { dominioNip, ipLocal } from "./oauth/lan.js";

const red = (idName, secretName) => ({
  clientId: process.env[idName] ?? "",
  clientSecret: process.env[secretName] ?? "",
});

const ip = ipLocal();
const movilPort = Number(process.env.OAUTH_MOVIL_PORT || 5176);

export const config = {
  port: Number(process.env.PORT || 3001),
  callbackPort: Number(process.env.OAUTH_CALLBACK_PORT || 5175),
  // web y emulador: localhost (ya registrado en las redes)
  redirectBase: process.env.OAUTH_REDIRECT_BASE || "http://localhost:5175",
  // celular físico: https con dominio nip.io apuntando a esta PC
  movilPort,
  movilDominio: ip ? dominioNip(ip) : "",
  movilBase: process.env.OAUTH_MOVIL_BASE || (ip ? `https://${dominioNip(ip)}:${movilPort}` : ""),
  db: {
    host: process.env.DB_HOST || "127.0.0.1",
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD ?? "",
    database: process.env.DB_NAME || "depaso",
  },
  oauth: {
    google: red("GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET"),
    discord: red("DISCORD_CLIENT_ID", "DISCORD_CLIENT_SECRET"),
    facebook: red("FACEBOOK_APP_ID", "FACEBOOK_APP_SECRET"),
  },
};
