import { useState } from 'react'
import { Save } from 'lucide-react'
import { missingFileMessage } from '../../utils/fileRules.js'
import { AdminField } from './AdminField.jsx'
import { AdminModal } from './AdminModal.jsx'

// modal para crear o editar un registro; onSave debe lanzar un error si la API rechaza los datos
export function ResourceFormModal({ config, initial, options, onSave, onClose }) {
  const [form, setForm] = useState(initial)
  const [state, setState] = useState({ busy: false, error: '' })

  const change = (event) => {
    const { name, value, type, checked } = event.target
    setForm((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value }))
  }
  const setFile = (name, value) => setForm((current) => ({ ...current, [name]: value }))

  const submit = async (event) => {
    event.preventDefault()
    const missing = missingFileMessage(config.fields, form)
    if (missing) return setState({ busy: false, error: missing })

    setState({ busy: true, error: '' })
    try { await onSave(form) } catch (error) { setState({ busy: false, error: error.message }) }
  }

  return (
    <AdminModal title={form.id ? `Editar ${config.singular}` : `Nuevo ${config.singular}`} onClose={onClose}>
      <form onSubmit={submit}>
        {state.error ? <p className="form-status error" role="alert">{state.error}</p> : null}
        <div className="admin-form-grid">
          {config.fields.map((field) => (
            <AdminField key={field.name} field={field} value={form[field.name]} onChange={change} onFile={setFile} options={options[field.name]} />
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
