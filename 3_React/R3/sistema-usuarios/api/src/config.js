import "dotenv/config";

export const config = {
  port: Number(process.env.PORT || 4000),
  jwtSecret: process.env.JWT_SECRET,
  db: { host: process.env.DB_HOST, port: Number(process.env.DB_PORT || 3306), user: process.env.DB_USER, password: process.env.DB_PASSWORD, database: process.env.DB_NAME },
};

export function requireConfig() {
  if (!config.jwtSecret || !config.db.host || !config.db.user || !config.db.database) throw new Error("Faltan variables obligatorias en .env");
}
