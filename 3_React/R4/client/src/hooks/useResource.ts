import { useCallback, useEffect, useState } from 'react'
import { useToast } from '../context/ToastContext'
import { api } from '../services/api'
import type { ResourceItem } from '../types/admin'

interface ResourceStatus {
  loading: boolean;
  error: string;
}

// lista de un recurso del panel (proyectos, logros, etc.) con sus acciones
export function useResource(resource: string) {
  const [items, setItems] = useState<ResourceItem[]>([])
  const toast = useToast()
  const [status, setStatus] = useState<ResourceStatus>({ loading: true, error: '' })

  const load = useCallback(async () => {
    try {
      const result = await api.list(resource) as { items: ResourceItem[] }
      setItems(result.items)
      setStatus({ loading: false, error: '' })
    } catch (error: any) { setStatus({ loading: false, error: error.message }) }
  }, [resource])

  useEffect(() => { load() }, [load])

  // save y remove lanzan el error para que el modal lo muestre; si salen bien, avisan con un toast
  const save = async (form: Record<string, unknown>) => {
    const response = form.id ? await api.update(resource, form) as { message: string } : await api.create(resource, form) as { message: string }
    await load()
    toast.success(response.message)
  }

  const remove = async (id: number) => {
    const response = await api.remove(resource, id) as { message: string }
    await load()
    toast.success(response.message)
  }

  // muestro el orden nuevo enseguida y lo guardo; si falla, vuelvo a leer el orden real
  const reorder = async (nextItems: ResourceItem[], ids: number[]) => {
    setItems(nextItems)
    try {
      const response = await api.reorder(resource, ids) as { message: string }
      toast.success(response.message)
    } catch (error: any) {
      toast.error(error.message)
      await load()
    }
  }

  return { items, status, save, remove, reorder }
}
