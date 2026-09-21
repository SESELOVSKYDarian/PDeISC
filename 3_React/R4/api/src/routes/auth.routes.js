import { Router } from 'express'
import bcrypt from 'bcryptjs'
import rateLimit from 'express-rate-limit'
import { query } from '../services/db.js'
import { cookieOptions, createToken, requireAuth, SESSION_COOKIE } from '../middleware/auth.js'
import { validateLogin } from '../utils/validators.js'

const router = Router()
const loginLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 10, standardHeaders: true, legacyHeaders: false })

router.post('/auth/login', loginLimiter, async (req, res, next) => {
  try {
    const { data, valid } = validateLogin(req.body)
    if (!valid) return res.status(422).json({ message: 'Correo o contraseña inválidos.' })
    const [admin] = await query('SELECT id, nombre, email, password_hash FROM administradores WHERE email = ?', [data.email])
    const matches = admin ? await bcrypt.compare(data.password, admin.password_hash) : false
    if (!matches) return res.status(401).json({ message: 'Correo o contraseña incorrectos.' })
    res.cookie(SESSION_COOKIE, createToken(admin), cookieOptions)
    return res.json({ admin: { id: admin.id, nombre: admin.nombre, email: admin.email } })
  } catch (error) {
    return next(error)
  }
})

router.post('/auth/sesion', requireAuth, (req, res) => res.json({ admin: req.admin }))

router.post('/auth/logout', (req, res) => {
  res.clearCookie(SESSION_COOKIE, { path: '/' })
  res.json({ message: 'Sesión cerrada.' })
})

export default router
