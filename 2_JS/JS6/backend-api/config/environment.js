// acá centralizo todas las variables de entorno para no repetir process.env por todos lados
import dotenv from 'dotenv';

dotenv.config();

export const ENV = {
  PORT: process.env.PORT || 3000,
  DB_HOST: process.env.DB_HOST || 'localhost',
  DB_PORT: process.env.DB_PORT || 3306,
  DB_USER: process.env.DB_USER || 'root',
  DB_PASSWORD: process.env.DB_PASSWORD || '',
  DB_NAME: process.env.DB_NAME || 'Score',
  CORS_ORIGIN: process.env.CORS_ORIGIN || '*',
  ADMIN_EMAIL: process.env.ADMIN_EMAIL || '',
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || '',
  SESSION_SECRET: process.env.SESSION_SECRET || 'cambiar-esta-clave-en-produccion',
  SMTP_HOST: process.env.SMTP_HOST || '',
  SMTP_PORT: Number(process.env.SMTP_PORT || 587),
  SMTP_USER: process.env.SMTP_USER || '',
  SMTP_PASSWORD: process.env.SMTP_PASSWORD || '',
  AUTH_CODE_MINUTES: Number(process.env.AUTH_CODE_MINUTES || 10),
  SESSION_DAYS: 7
};
