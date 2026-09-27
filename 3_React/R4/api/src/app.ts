import path from 'node:path'
import { fileURLToPath } from 'node:url'
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import helmet from 'helmet'
import { config, isProduction } from './config.js'
import portfolioRoutes from './routes/portfolio.routes.js'
import authRoutes from './routes/auth.routes.js'
import adminRoutes from './routes/admin/index.js'
import uploadRoutes from './routes/upload.routes.js'
import orderRoutes from './routes/order.routes.js'
import fileRoutes from './routes/files.routes.js'
import { errorHandler, notFound } from './middleware/errors.js'

export const app = express()
app.set('trust proxy', 1)
app.use(helmet({
  contentSecurityPolicy: isProduction ? {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
      fontSrc: ["'self'", 'https://fonts.gstatic.com', 'data:'],
      imgSrc: ["'self'", 'data:', 'https:'],
      connectSrc: ["'self'"]
    }
  } : false,
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}))
app.use(cors({ origin: config.clientUrl, credentials: true }))
app.use(cookieParser())
// la subida de archivos va antes: tiene su propio límite de tamaño y pide sesión antes de leer el cuerpo
app.use('/api/admin/archivos', uploadRoutes)
app.use(express.json({ limit: '256kb' }))
app.use('/archivos', fileRoutes)

app.use('/api', portfolioRoutes)
app.use('/api', authRoutes)
app.use('/api', orderRoutes)
app.use('/api', adminRoutes)

if (isProduction) {
  const here = path.dirname(fileURLToPath(import.meta.url))
  const clientDist = path.resolve(here, '../../client/dist')
  app.use(express.static(clientDist, { maxAge: '1d', index: false }))
  app.get('*splat', (req, res) => res.sendFile(path.join(clientDist, 'index.html')))
} else {
  app.use(notFound)
}

app.use(errorHandler)
