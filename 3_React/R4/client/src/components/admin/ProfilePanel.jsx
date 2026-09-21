import { useEffect, useState } from 'react'
import { Save } from 'lucide-react'
import { api } from '../../services/api.js'
import { isFileField, missingFileMessage } from '../../utils/fileRules.js'
import { FileField } from './FileField.jsx'
import { profileFields } from './resourceConfigs.js'

export function ProfilePanel() {
  const [form, setForm] = useState(null)
  const [status, setStatus] = useState({ loading: true, message: '', error: '' })

  useEffect(() => {
    api.list('perfil')
      .then((data) => { setForm(data.item); setStatus({ loading: false, message: '', error: '' }) })
      .catch((error) => setStatus({ loading: false, message: '', error: error.message }))
  }, [])

  const change = (event) => setForm({ ...form, [event.target.name]: event.target.value })
  const setFile = (name, value) => setForm({ ...form, [name]: value })

  const save = async (event) => {
    event.preventDefault()
    const missing = missingFileMessage(profileFields, form)
    if (missing) return setStatus({ loading: false, message: '', error: missing })
    setStatus({ loading: false, message: '', error: '' })
    try {
      const result = await api.updateProfile(form)
      setStatus({ loading: false, message: result.message, error: '' })
    } catch (error) {
      setStatus({ loading: false, message: '', error: error.message })
    }
  }

  if (status.loading) return <section className="admin-panel-card"><p>Cargando perfil…</p></section>
  if (!form) return <section className="admin-panel-card"><p className="form-status error" role="alert">{status.error || 'No se pudo cargar el perfil.'}</p></section>

  return (
    <section className="admin-panel-card">
      <div className="panel-heading"><div><p className="eyebrow">Identidad</p><h2>Perfil principal</h2></div></div>
      {status.message ? <p className="form-status success" role="status">{status.message}</p> : null}
      {status.error ? <p className="form-status error" role="alert">{status.error}</p> : null}
      <form className="admin-form-grid" onSubmit={save}>
        {profileFields.map((field) => isFileField(field) ? <FileField key={field.name} field={field} value={form[field.name]} onChange={setFile} /> : (
          <label key={field.name} className={field.type === 'textarea' ? 'field field-wide' : 'field'}>
            <span>{field.label}</span>
            {field.type === 'textarea'
              ? <textarea rows="4" name={field.name} value={form[field.name] ?? ''} onChange={change} required />
              : <input type={field.type} name={field.name} value={form[field.name] ?? ''} onChange={change} required />}
          </label>
        ))}
        <div className="field-wide"><button className="button button-primary"><Save /> Guardar perfil</button></div>
      </form>
    </section>
  )
}
