import { Router, type NextFunction, type Request, type Response } from 'express'
import { query } from '../../services/db.js'
import { nextOrder } from '../../services/order.js'
import { cleanText, isUrl, toOrder, toPositiveId } from '../../utils/validators.js'

const router = Router()

interface ResourceConfig {
  table: string;
  fields: string[];
  parse: (body: Record<string, unknown>) => Record<string, unknown>;
  validate: (data: Record<string, any>) => boolean;
}

// listas simples: categorías, enlaces, experiencias y logros comparten el mismo CRUD
const resources: Record<string, ResourceConfig> = {
  'categorias-habilidades': {
    table: 'categorias_habilidades',
    fields: ['nombre', 'imagen_url', 'orden'],
    parse: (body) => ({ nombre: cleanText(body.nombre, 80), imagen_url: cleanText(body.imagen_url, 500), orden: toOrder(body.orden) }),
    validate: (data) => data.nombre.length >= 2 && Boolean(data.imagen_url) && isUrl(data.imagen_url)
  },
  'enlaces-sociales': {
    table: 'enlaces_sociales',
    fields: ['nombre', 'url', 'orden'],
    parse: (body) => ({ nombre: cleanText(body.nombre, 50), url: cleanText(body.url, 500), orden: toOrder(body.orden) }),
    validate: (data) => data.nombre.length >= 2 && isUrl(data.url)
  },
  experiencias: {
    table: 'experiencias',
    fields: ['titulo', 'organizacion', 'periodo', 'descripcion', 'orden'],
    parse: (body) => ({ titulo: cleanText(body.titulo, 120), organizacion: cleanText(body.organizacion, 120), periodo: cleanText(body.periodo, 80), descripcion: cleanText(body.descripcion, 800), orden: toOrder(body.orden) }),
    validate: (data) => data.titulo.length >= 2 && data.organizacion.length >= 2 && data.periodo.length >= 2 && data.descripcion.length >= 10
  },
  logros: {
    table: 'logros',
    fields: ['titulo', 'descripcion', 'fecha', 'orden'],
    parse: (body) => ({ titulo: cleanText(body.titulo, 120), descripcion: cleanText(body.descripcion, 500), fecha: cleanText(body.fecha, 40), orden: toOrder(body.orden) }),
    validate: (data) => data.titulo.length >= 2 && data.descripcion.length >= 5 && data.fecha.length >= 2
  }
}

const list = async (resource: ResourceConfig, res: Response) => {
  const items = await query(`SELECT * FROM ${resource.table} ORDER BY orden, id`)
  return res.json({ items })
}

const remove = async (resource: ResourceConfig, req: Request, res: Response) => {
  const id = toPositiveId(req.body.id)
  if (!id) return res.status(422).json({ message: 'Identificador inválido.' })
  await query(`DELETE FROM ${resource.table} WHERE id = ?`, [id])
  return res.json({ message: 'Registro eliminado.' })
}

// los registros nuevos van al final de la lista
const create = async (resource: ResourceConfig, data: Record<string, any>, res: Response) => {
  data.orden = await nextOrder(resource.table)
  const placeholders = resource.fields.map(() => '?').join(', ')
  const result = await query<{ insertId: number }>(`INSERT INTO ${resource.table} (${resource.fields.join(', ')}) VALUES (${placeholders})`, resource.fields.map((field) => data[field]))
  return res.status(201).json({ message: 'Registro creado.', id: result.insertId })
}

// editar nunca cambia el lugar: el orden solo se toca arrastrando
const update = async (resource: ResourceConfig, data: Record<string, any>, req: Request, res: Response) => {
  const id = toPositiveId(req.body.id)
  if (!id) return res.status(422).json({ message: 'Identificador inválido.' })
  const editable = resource.fields.filter((field) => field !== 'orden')
  const setters = editable.map((field) => `${field} = ?`).join(', ')
  await query(`UPDATE ${resource.table} SET ${setters} WHERE id = ?`, [...editable.map((field) => data[field]), id])
  return res.json({ message: 'Registro actualizado.' })
}

const resourceHandler = (action: string) => async (req: Request, res: Response, next: NextFunction) => {
  try {
    const recurso = req.params.recurso as string
    const resource = Object.hasOwn(resources, recurso) ? resources[recurso] : null
    if (!resource) return next()
    if (action === 'listar') return await list(resource, res)
    if (action === 'eliminar') return await remove(resource, req, res)

    const data = resource.parse(req.body)
    if (!resource.validate(data)) return res.status(422).json({ message: 'Revisá los datos ingresados.' })
    return await (action === 'crear' ? create(resource, data, res) : update(resource, data, req, res))
  } catch (error) {
    return next(error)
  }
}

for (const action of ['listar', 'crear', 'actualizar', 'eliminar']) {
  router.post(`/admin/:recurso/${action}`, resourceHandler(action))
}

export default router
