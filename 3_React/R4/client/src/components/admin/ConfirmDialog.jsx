import { useState } from 'react'
import { Trash2 } from 'lucide-react'
import { AdminModal } from './AdminModal.jsx'

// pide confirmación antes de una acción que no se puede deshacer
export function ConfirmDialog({ title, message, confirmLabel = 'Sí, eliminar', onConfirm, onClose }) {
  const [state, setState] = useState({ busy: false, error: '' })

  const confirm = async () => {
    setState({ busy: true, error: '' })
    try { await onConfirm() } catch (error) { setState({ busy: false, error: error.message }) }
  }

  return (
    <AdminModal title={title} onClose={onClose}>
      <p className="modal-message">{message}</p>
      {state.error ? <p className="form-status error" role="alert">{state.error}</p> : null}
      <div className="modal-actions">
        <button type="button" className="button button-ghost" onClick={onClose}>Cancelar</button>
        <button type="button" className="button button-danger" onClick={confirm} disabled={state.busy}><Trash2 /> {state.busy ? 'Eliminando…' : confirmLabel}</button>
      </div>
    </AdminModal>
  )
}
