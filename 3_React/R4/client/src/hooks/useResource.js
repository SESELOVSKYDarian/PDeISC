import { useCallback, useEffect, useState } from 'react'
import { api } from '../services/api.js'

// lista de un recurso del panel (proyectos, logros, etc.) con sus acciones
export function useResource(resource) {
  const [items, setItems] = useState([])
  const [status, setStatus] = useState({ loading: true, message: '', error: '' })

  const load = useCallback(async () => {
    try {
      const result = await api.list(resource)
      setItems(result.items)
      setStatus((current) => ({ ...current, loading: false, error: '' }))
    } catch (error) { setStatus({ loading: false, message: '', error: error.message }) }
  }, [resource])

  useEffect(() => { load() }, [load])

  // save y remove lanzan el error para que el modal lo muestre
  const save = async (form) => {
    const response = form.id ? await api.update(resource, form) : await api.create(resource, form)
    await load()
    setStatus((current) => ({ ...current, message: response.message, error: '' }))
  }

  const remove = async (id) => {
    const response = await api.remove(resource, id)
    await load()
    setStatus((current) => ({ ...current, message: response.message, error: '' }))
  }

  // muestro el orden nuevo enseguida y lo guardo; si falla, vuelvo a leer el orden real
  const reorder = async (nextItems, ids) => {
    setItems(nextItems)
    setStatus((current) => ({ ...current, message: '', error: '' }))
    try {
      await api.reorder(resource, ids)
    } catch (error) {
      setStatus((current) => ({ ...current, error: error.message }))
      await load()
    }
  }

  return { items, status, save, remove, reorder }
}
