import { useState, type FormEvent } from 'react'
import { KeyRound, ShieldCheck } from 'lucide-react'
import { AdminModal } from './AdminModal'
import type { ApiError } from '../../services/api'

interface AccountChangeModalProps {
  changes: string[];
  onConfirm: (currentPassword: string) => Promise<void>;
  onClose: () => void;
}

// paso 1: pregunta si está seguro; paso 2: pide la contraseña actual antes de guardar
export function AccountChangeModal({ changes, onConfirm, onClose }: AccountChangeModalProps) {
  const [step, setStep] = useState<'confirm' | 'password'>('confirm')
  const [password, setPassword] = useState('')
  const [state, setState] = useState({ busy: false, error: '' })

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    setState({ busy: true, error: '' })
    try { await onConfirm(password) } catch (error) { setState({ busy: false, error: (error as ApiError).message }) }
  }

  if (step === 'confirm') {
    return (
      <AdminModal title="¿Cambiar tus datos de acceso?" onClose={onClose}>
        <p className="modal-message">Vas a cambiar: {changes.join(' y ')}. La próxima vez tendrás que ingresar con los datos nuevos.</p>
        <div className="modal-actions">
          <button type="button" className="button button-ghost" onClick={onClose}>Cancelar</button>
          <button type="button" className="button button-primary" onClick={() => setStep('password')}><ShieldCheck /> Sí, continuar</button>
        </div>
      </AdminModal>
    )
  }

  return (
    <AdminModal title="Confirmá tu contraseña" onClose={onClose}>
      <form onSubmit={submit}>
        <p className="modal-message">Por seguridad, ingresá tu contraseña actual para guardar los cambios.</p>
        {state.error ? <p className="form-status error" role="alert">{state.error}</p> : null}
        <label className="field">
          <span>Contraseña actual</span>
          <input type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} required />
        </label>
        <div className="modal-actions">
          <button type="button" className="button button-ghost" onClick={onClose}>Cancelar</button>
          <button type="submit" className="button button-primary" disabled={state.busy || !password}><KeyRound /> {state.busy ? 'Guardando…' : 'Guardar cambios'}</button>
        </div>
      </form>
    </AdminModal>
  )
}
