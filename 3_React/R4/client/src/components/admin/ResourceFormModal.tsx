import { useState, type ChangeEvent, type FormEvent } from 'react'
import { Save } from 'lucide-react'
import { missingFileMessage } from '../../utils/fileRules'
import { AdminField } from './AdminField'
import { AdminModal } from './AdminModal'
import type { ApiError } from '../../services/api'
import type { FieldOptionsMap, ResourceConfig, ResourceItem } from '../../types/admin'

interface ResourceFormModalProps {
  config: ResourceConfig;
  initial: Record<string, unknown>;
  options: FieldOptionsMap;
  onSave: (form: Record<string, unknown>) => Promise<void>;
  onClose: () => void;
}

// modal para crear o editar un registro; onSave debe lanzar un error si la API rechaza los datos
export function ResourceFormModal({ config, initial, options, onSave, onClose }: ResourceFormModalProps) {
  const [form, setForm] = useState<Record<string, unknown>>(initial)
  const [state, setState] = useState({ busy: false, error: '' })

  const change = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = event.target
    const checked = (event.target as HTMLInputElement).checked
    setForm((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value }))
  }
  const setFile = (name: string, value: string) => setForm((current) => ({ ...current, [name]: value }))

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    const missing = missingFileMessage(config.fields, form)
    if (missing) return setState({ busy: false, error: missing })

    setState({ busy: true, error: '' })
    try { await onSave(form) } catch (error) { setState({ busy: false, error: (error as ApiError).message }) }
  }

  return (
    <AdminModal title={form.id ? `Editar ${config.singular}` : `Nuevo ${config.singular}`} onClose={onClose}>
      <form onSubmit={submit}>
        {state.error ? <p className="form-status error" role="alert">{state.error}</p> : null}
        <div className="admin-form-grid">
          {config.fields.map((field) => (
            <AdminField key={field.name} field={field} value={(form as ResourceItem)[field.name]} onChange={change} onFile={setFile} options={options[field.name]} />
          ))}
        </div>
        <div className="modal-actions">
          <button type="button" className="button button-ghost" onClick={onClose}>Cancelar</button>
          <button type="submit" className="button button-primary" disabled={state.busy}><Save /> {state.busy ? 'Guardando…' : 'Guardar'}</button>
        </div>
      </form>
    </AdminModal>
  )
}
