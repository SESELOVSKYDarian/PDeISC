import { useState, type ChangeEvent, type FormEvent } from 'react'
import { Save } from 'lucide-react'
import { useToast } from '../../context/ToastContext'
import { api } from '../../services/api'
import { AccountChangeModal } from './AccountChangeModal'
import type { AdminSession } from '../../types/admin'

interface AccountPanelProps {
  admin: AdminSession;
  onUpdated: (admin: AdminSession) => void;
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// formulario para cambiar el correo y/o la contraseña del administrador
export function AccountPanel({ admin, onUpdated }: AccountPanelProps) {
  const toast = useToast()
  const [form, setForm] = useState({ email: admin.email, newPassword: '', confirmPassword: '' })
  const [error, setError] = useState('')
  const [pending, setPending] = useState<string[] | null>(null)

  const change = (event: ChangeEvent<HTMLInputElement>) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }))

  const emailChanged = form.email.trim().toLowerCase() !== admin.email.toLowerCase()
  const passwordChanged = form.newPassword.length > 0

  // valido en el cliente y, si todo está bien, abro el modal de confirmación
  const submit = (event: FormEvent) => {
    event.preventDefault()
    if (!emailChanged && !passwordChanged) return setError('No hay ningún cambio para guardar.')
    if (!emailPattern.test(form.email.trim())) return setError('Ingresá un correo válido.')
    if (passwordChanged && (form.newPassword.length < 8 || form.newPassword.length > 72)) return setError('La nueva contraseña debe tener entre 8 y 72 caracteres.')
    if (passwordChanged && form.newPassword !== form.confirmPassword) return setError('Las contraseñas nuevas no coinciden.')
    setError('')
    setPending([emailChanged && 'tu correo', passwordChanged && 'tu contraseña'].filter(Boolean) as string[])
  }

  const save = async (currentPassword: string) => {
    const result = await api.updateAccount({
      currentPassword,
      email: emailChanged ? form.email : '',
      newPassword: form.newPassword
    })
    setPending(null)
    setForm({ email: result.admin.email, newPassword: '', confirmPassword: '' })
    onUpdated(result.admin)
    toast.success(result.message)
  }

  return (
    <section className="admin-panel-card">
      <div className="panel-heading"><div><p className="eyebrow">Seguridad</p><h2>Datos de acceso</h2></div></div>
      <form className="admin-form-grid" onSubmit={submit} noValidate>
        {error ? <p className="form-status error field-wide" role="alert">{error}</p> : null}
        <label className="field field-wide">
          <span>Correo de acceso</span>
          <input type="email" name="email" autoComplete="email" value={form.email} onChange={change} required />
        </label>
        <label className="field">
          <span>Nueva contraseña (dejá vacío para no cambiarla)</span>
          <input type="password" name="newPassword" autoComplete="new-password" value={form.newPassword} onChange={change} />
        </label>
        <label className="field">
          <span>Repetir nueva contraseña</span>
          <input type="password" name="confirmPassword" autoComplete="new-password" value={form.confirmPassword} onChange={change} />
        </label>
        <div className="field-wide"><button className="button button-primary"><Save /> Guardar cambios</button></div>
      </form>
      {pending ? <AccountChangeModal changes={pending} onConfirm={save} onClose={() => setPending(null)} /> : null}
    </section>
  )
}
