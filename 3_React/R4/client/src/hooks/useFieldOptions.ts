import { useEffect, useState } from 'react'
import { api } from '../services/api'
import type { Field, FieldOptionsMap } from '../types/admin'

// opciones de los campos tipo lista (por ejemplo, las categorías de una habilidad): { campo: [{ value, label }] }
// devuelve null mientras carga
export function useFieldOptions(fields: Field[]): FieldOptionsMap | null {
  const [options, setOptions] = useState<FieldOptionsMap | null>(null)

  useEffect(() => {
    const selects = fields.filter((field) => field.type === 'select')
    Promise.all(selects.map((field) => api.list(field.optionsFrom as string))).then((results: any[]) => {
      const next: FieldOptionsMap = {}
      selects.forEach((field, index) => { next[field.name] = results[index].items.map((item: any) => ({ value: item.id, label: item.nombre })) })
      setOptions(next)
    }).catch(() => setOptions({}))
  }, [fields])

  return options
}
