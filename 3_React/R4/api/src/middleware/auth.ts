import jwt from 'jsonwebtoken'
import type { CookieOptions, NextFunction, Request, Response } from 'express'
import { config, isProduction } from '../config.js'
import type { AdminSession } from '../types/express.js'

export const SESSION_COOKIE = 'portfolio_session'

export const cookieOptions: CookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: 'lax',
  maxAge: 8 * 60 * 60 * 1000,
  path: '/'
}

export const createToken = (admin: AdminSession): string => jwt.sign(
  { id: admin.id, email: admin.email, nombre: admin.nombre },
  config.jwtSecret,
  { expiresIn: '8h' }
)

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies[SESSION_COOKIE]
  if (!token) return res.status(401).json({ message: 'Necesitás iniciar sesión.' })
  try {
    req.admin = jwt.verify(token, config.jwtSecret) as AdminSession
    return next()
  } catch {
    res.clearCookie(SESSION_COOKIE, { path: '/' })
    return res.status(401).json({ message: 'La sesión venció. Volvé a ingresar.' })
  }
}
