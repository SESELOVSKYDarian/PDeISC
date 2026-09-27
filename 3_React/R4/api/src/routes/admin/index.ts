import { Router } from 'express'
import { requireAuth } from '../../middleware/auth.js'
import messageRoutes from './messages.routes.js'
import profileRoutes from './profile.routes.js'
import projectRoutes from './projects.routes.js'
import resourceRoutes from './resources.routes.js'
import skillRoutes from './skills.routes.js'

const router = Router()

// todo lo de /admin exige sesión; las rutas de cada recurso están en su propio archivo
router.use('/admin', requireAuth)
router.use(resourceRoutes, skillRoutes, profileRoutes, projectRoutes, messageRoutes)

export default router
