import 'dotenv/config'

const numberFromEnv = (value, fallback) => {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

export const config = {
  port: numberFromEnv(process.env.PORT, 4000),
  nodeEnv: process.env.NODE_ENV || 'development',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  database: {
    host: process.env.DB_HOST || '127.0.0.1',
    port: numberFromEnv(process.env.DB_PORT, 3306),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    name: process.env.DB_NAME || 'portfolio_r4'
  },
  jwtSecret: process.env.JWT_SECRET || 'solo-desarrollo-cambiar-este-secreto-por-favor',
  admin: {
    name: process.env.ADMIN_NAME || 'Administrador',
    email: process.env.ADMIN_EMAIL || 'admin@portfolio.local',
    password: process.env.ADMIN_PASSWORD || 'Cambiar123!'
  }
}

export const isProduction = config.nodeEnv === 'production'
