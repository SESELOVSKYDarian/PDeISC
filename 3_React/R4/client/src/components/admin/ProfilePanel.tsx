import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react'
import { Save } from 'lucide-react'
import { useToast } from '../../context/ToastContext'
import { api } from '../../services/api'
import { isFileField, missingFileMessage } from '../../utils/fileRules'
import { FileField } from './FileField'
import { profileFields } from './resourceConfigs'
import type { ApiError } from '../../services/api'
import type { Profile } from '../../types/portfolio'

export function ProfilePanel() {
  const toast = useToast()
  const [form, setForm] = useState<Profile | null>(null)
  const [status, setStatus] = useState({ loading: true, error: '' })

  useEffect(() => {
    api.list('perfil')
      .then((data: any) => { setForm(data.item); setStatus({ loading: false, error: '' }) })
      .catch((error: ApiError) => setStatus({ loading: false, error: error.message }))
  }, [])

  const change = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm((current) => current && ({ ...current, [event.target.name]: event.target.value }))
  const setFile = (name: string, value: string) => setForm((current) => current && ({ ...current, [name]: value }))

  // el resultado (bien o mal) se avisa con un toast: se ve aunque el formulario sea largo
  const save = async (event: FormEvent) => {
    event.preventDefault()
    if (!form) return
    const missing = missingFileMessage(profileFields, form)
    if (missing) return toast.error(missing)
    try {
      const result = await api.updateProfile(form) as { message: string }
      toast.success(result.message)
    } catch (error) {
      toast.error((error as ApiError).message)
    }
  }

  if (status.loading) return <section className="admin-panel-card"><p>Cargando perfil…</p></section>
  if (!form) return <section className="admin-panel-card"><p className="form-status error" role="alert">{status.error || 'No se pudo cargar el perfil.'}</p></section>

  return (
    <section className="admin-panel-card">
      <div className="panel-heading"><div><p className="eyebrow">Identidad</p><h2>Perfil principal</h2></div></div>
      <form className="admin-form-grid" onSubmit={save}>
        {profileFields.map((field) => isFileField(field) ? <FileField key={field.name} field={field} value={(form[field.name] ?? '') as string} onChange={setFile} /> : (
          <label key={field.name} className={field.type === 'textarea' ? 'field field-wide' : 'field'}>
            <span>{field.label}</span>
            {field.type === 'textarea'
              ? <textarea rows={4} name={field.name} value={(form[field.name] ?? '') as string} onChange={change} required />
              : <input type={field.type} name={field.name} value={(form[field.name] ?? '') as string} onChange={change} required />}
          </label>
        ))}
        <div className="field-wide"><button className="button button-primary"><Save /> Guardar perfil</button></div>
      </form>
    </section>
  )
}
