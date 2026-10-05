import { Router } from 'express'
import bcrypt from 'bcryptjs'
import rateLimit from 'express-rate-limit'
import { query } from '../services/db.js'
import { cookieOptions, createToken, requireAuth, SESSION_COOKIE } from '../middleware/auth.js'
import { validateAccountChange, validateLogin } from '../utils/validators.js'

const router = Router()
const accountLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 10, standardHeaders: true, legacyHeaders: false })
const loginLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 10, standardHeaders: true, legacyHeaders: false })

router.post('/auth/login', loginLimiter, async (req, res, next) => {
  try {
    const { data, valid } = validateLogin(req.body)
    if (!valid) return res.status(422).json({ message: 'Correo o contraseña inválidos.' })
    const [admin] = await query<any[]>('SELECT id, nombre, email, password_hash FROM administradores WHERE email = ?', [data.email])
    const matches = admin ? await bcrypt.compare(data.password, admin.password_hash) : false
    if (!matches) return res.status(401).json({ message: 'Correo o contraseña incorrectos.' })
    res.cookie(SESSION_COOKIE, createToken(admin), cookieOptions)
    return res.json({ admin: { id: admin.id, nombre: admin.nombre, email: admin.email } })
  } catch (error) {
    return next(error)
  }
})

router.post('/auth/sesion', requireAuth, (req, res) => res.json({ admin: req.admin }))

// cambia correo y/o contraseña: exige la contraseña actual aunque ya haya sesión
router.post('/auth/cuenta/actualizar', requireAuth, accountLimiter, async (req, res, next) => {
  try {
    const { data, errors } = validateAccountChange(req.body)
    if (Object.keys(errors).length) return res.status(422).json({ message: Object.values(errors)[0], errors })
    const [admin] = await query<any[]>('SELECT id, nombre, email, password_hash FROM administradores WHERE id = ?', [req.admin!.id])
    if (!admin) return res.status(401).json({ message: 'La sesión venció. Volvé a ingresar.' })
    // 403 y no 401: el cliente no debe confundir "contraseña mal" con "sesión vencida"
    if (!await bcrypt.compare(data.currentPassword, admin.password_hash)) return res.status(403).json({ message: 'La contraseña actual no es correcta.' })

    const email = data.email || admin.email
    const [taken] = await query<any[]>('SELECT id FROM administradores WHERE email = ? AND id <> ?', [email, admin.id])
    if (taken) return res.status(409).json({ message: 'Ese correo ya está en uso.' })
    const passwordHash = data.newPassword ? await bcrypt.hash(data.newPassword, 12) : admin.password_hash
    await query('UPDATE administradores SET email = ?, password_hash = ? WHERE id = ?', [email, passwordHash, admin.id])

    // el token lleva el correo, así que se emite uno nuevo
    const session = { id: admin.id, nombre: admin.nombre, email }
    res.cookie(SESSION_COOKIE, createToken(session), cookieOptions)
    return res.json({ message: 'Datos de acceso actualizados.', admin: session })
  } catch (error) {
    return next(error)
  }
})

router.post('/auth/logout', (req, res) => {
  res.clearCookie(SESSION_COOKIE, { path: '/' })
  res.json({ message: 'Sesión cerrada.' })
})

export default router
