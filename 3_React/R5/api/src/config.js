import "dotenv/config";

const provider = (idName, secretName) => ({ clientId: process.env[idName], clientSecret: process.env[secretName] });

export const config = {
  port: Number(process.env.PORT || 4005),
  // dónde corre el cliente: CORS y redirect_uri de OAuth salen de acá
  clientUrl: process.env.CLIENT_URL || "http://localhost:5175",
  jwtSecret: process.env.JWT_SECRET,
  db: { host: process.env.DB_HOST, port: Number(process.env.DB_PORT || 3306), user: process.env.DB_USER, password: process.env.DB_PASSWORD, database: process.env.DB_NAME },
  oauth: {
    google: provider("GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET"),
    github: provider("GITHUB_CLIENT_ID", "GITHUB_CLIENT_SECRET"),
    meta: provider("META_APP_ID", "META_APP_SECRET"),
  },
};

export function requireConfig() {
  if (!config.jwtSecret || !config.db.host || !config.db.user || !config.db.database) throw new Error("Faltan variables obligatorias en .env");
}
