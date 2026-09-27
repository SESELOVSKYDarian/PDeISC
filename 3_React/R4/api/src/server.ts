import { app } from './app.js'
import { config } from './config.js'
import { query } from './services/db.js'

const server = app.listen(config.port, () => {
  console.log(`API disponible en http://localhost:${config.port}`)
})

const shutdown = () => server.close(() => process.exit(0))
process.on('SIGTERM', shutdown)
process.on('SIGINT', shutdown)

query('SELECT 1').catch((error) => console.error('No se pudo conectar a MySQL:', error.message))
