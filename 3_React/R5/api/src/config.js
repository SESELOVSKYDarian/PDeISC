import "dotenv/config";

// redirectBase (opcional): dirección del cliente para esa red si es distinta de CLIENT_URL (por ejemplo, Facebook exige https)
const provider = (idName, secretName, baseName) => ({ clientId: process.env[idName], clientSecret: process.env[secretName], redirectBase: process.env[baseName] });

export const config = {
  port: Number(process.env.PORT || 4005),
  // dónde corre el cliente: CORS y redirect_uri de OAuth salen de acá
  clientUrl: process.env.CLIENT_URL || "http://localhost:5175",
  jwtSecret: process.env.JWT_SECRET,
  db: { host: process.env.DB_HOST, port: Number(process.env.DB_PORT || 3306), user: process.env.DB_USER, password: process.env.DB_PASSWORD, database: process.env.DB_NAME },
  oauth: {
    google: provider("GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET", "GOOGLE_REDIRECT_BASE"),
    github: provider("GITHUB_CLIENT_ID", "GITHUB_CLIENT_SECRET", "GITHUB_REDIRECT_BASE"),
    discord: provider("DISCORD_CLIENT_ID", "DISCORD_CLIENT_SECRET", "DISCORD_REDIRECT_BASE"),
    facebook: provider("FACEBOOK_APP_ID", "FACEBOOK_APP_SECRET", "FACEBOOK_REDIRECT_BASE"),
    x: provider("X_CLIENT_ID", "X_CLIENT_SECRET", "X_REDIRECT_BASE"),
    twitch: provider("TWITCH_CLIENT_ID", "TWITCH_CLIENT_SECRET", "TWITCH_REDIRECT_BASE"),
  },
};

export function requireConfig() {
  if (!config.jwtSecret || !config.db.host || !config.db.user || !config.db.database) throw new Error("Faltan variables obligatorias en .env");
}
