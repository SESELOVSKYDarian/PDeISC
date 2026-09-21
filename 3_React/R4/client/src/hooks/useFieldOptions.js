import { useEffect, useState } from 'react'
import { api } from '../services/api.js'

// opciones de los campos tipo lista (por ejemplo, las categorías de una habilidad): { campo: [{ value, label }] }
// devuelve null mientras carga
export function useFieldOptions(fields) {
  const [options, setOptions] = useState(null)

  useEffect(() => {
    const selects = fields.filter((field) => field.type === 'select')
    Promise.all(selects.map((field) => api.list(field.optionsFrom))).then((results) => {
      const next = {}
      selects.forEach((field, index) => { next[field.name] = results[index].items.map((item) => ({ value: item.id, label: item.nombre })) })
      setOptions(next)
    }).catch(() => setOptions({}))
  }, [fields])

  return options
}
