import { useCallback, useEffect, useState } from 'react'
import { useToast } from '../context/ToastContext.jsx'
import { api } from '../services/api.js'

// lista de un recurso del panel (proyectos, logros, etc.) con sus acciones
export function useResource(resource) {
  const [items, setItems] = useState([])
  const toast = useToast()
  const [status, setStatus] = useState({ loading: true, error: '' })

  const load = useCallback(async () => {
    try {
      const result = await api.list(resource)
      setItems(result.items)
      setStatus({ loading: false, error: '' })
    } catch (error) { setStatus({ loading: false, error: error.message }) }
  }, [resource])

  useEffect(() => { load() }, [load])

  // save y remove lanzan el error para que el modal lo muestre; si salen bien, avisan con un toast
  const save = async (form) => {
    const response = form.id ? await api.update(resource, form) : await api.create(resource, form)
    await load()
    toast.success(response.message)
  }

  const remove = async (id) => {
    const response = await api.remove(resource, id)
    await load()
    toast.success(response.message)
  }

  // muestro el orden nuevo enseguida y lo guardo; si falla, vuelvo a leer el orden real
  const reorder = async (nextItems, ids) => {
    setItems(nextItems)
    try {
      const response = await api.reorder(resource, ids)
      toast.success(response.message)
    } catch (error) {
      toast.error(error.message)
      await load()
    }
  }

  return { items, status, save, remove, reorder }
}
