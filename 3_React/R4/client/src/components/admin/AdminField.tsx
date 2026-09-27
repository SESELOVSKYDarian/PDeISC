import type { ChangeEvent } from 'react'
import { isFileField } from '../../utils/fileRules'
import { FileField } from './FileField'
import type { Field, FieldOption } from '../../types/admin'

interface AdminFieldProps {
  field: Field;
  value: unknown;
  onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onFile: (name: string, value: string) => void;
  options?: FieldOption[];
}

// un campo del formulario según su tipo: texto, número, área, lista, casilla o archivo
export function AdminField({ field, value, onChange, onFile, options = [] }: AdminFieldProps) {
  if (isFileField(field)) return <FileField field={field} value={value as string} onChange={onFile} />

  if (field.type === 'checkbox') {
    return <label className="checkbox-field"><input name={field.name} type="checkbox" checked={Boolean(value)} onChange={onChange} /><span>{field.label}</span></label>
  }

  const common = { name: field.name, value: (value ?? '') as string, onChange, required: !field.optional }
  let control

  if (field.type === 'textarea') control = <textarea {...common} rows={4} />
  else if (field.type === 'select') control = <select {...common}>{options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select>
  else control = <input {...common} type={field.type} min={field.min} max={field.max} />

  return <label className={field.type === 'textarea' ? 'field field-wide' : 'field'}><span>{field.label}</span>{control}</label>
}
