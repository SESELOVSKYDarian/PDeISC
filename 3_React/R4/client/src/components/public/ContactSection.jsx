import { useState } from 'react'
import { ArrowRight, Mail } from 'lucide-react'
import { api } from '../../services/api.js'
import { validateContact } from '../../utils/validation.js'

const initialValues = { nombre: '', email: '', asunto: '', mensaje: '' }

export function ContactSection({ profile }) {
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState({ type: '', message: '' })
  const [sending, setSending] = useState(false)

  const update = (event) => {
    const { name, value } = event.target
    setValues((current) => ({ ...current, [name]: value }))
    if (errors[name]) setErrors((current) => ({ ...current, [name]: '' }))
  }
  const submit = async (event) => {
    event.preventDefault()
    const nextErrors = validateContact(values)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) return
    setSending(true); setStatus({ type: '', message: '' })
    try {
      const response = await api.contact(values)
      setValues(initialValues); setStatus({ type: 'success', message: response.message })
    } catch (error) {
      setErrors(error.errors || {}); setStatus({ type: 'error', message: error.message })
    } finally { setSending(false) }
  }

  return (
    <section id="contacto" className="content-section section-anchor contact-section">
      <div className="contact-copy" data-reveal="left"><p className="eyebrow">Empecemos algo</p><h2>¿Tenés una idea?<br /><span>Hagámosla realidad.</span></h2><p>Contame qué necesitás. El mensaje queda guardado de forma segura para poder responderte.</p><a href={`mailto:${profile.email}`}><Mail size={18} /> {profile.email}</a></div>
      <form className="contact-form" onSubmit={submit} noValidate data-reveal="right" style={{ '--i': 1 }}>
        <Field label="Nombre" name="nombre" value={values.nombre} error={errors.nombre} onChange={update} autoComplete="name" />
        <Field label="Correo" name="email" type="email" value={values.email} error={errors.email} onChange={update} autoComplete="email" />
        <Field label="Asunto" name="asunto" value={values.asunto} error={errors.asunto} onChange={update} />
        <label className={errors.mensaje ? 'field has-error field-wide' : 'field field-wide'}><span>Mensaje</span><textarea name="mensaje" rows="5" value={values.mensaje} onChange={update} maxLength="2000" aria-invalid={Boolean(errors.mensaje)} />{errors.mensaje ? <small>{errors.mensaje}</small> : null}</label>
        {status.message ? <p className={`form-status ${status.type}`} role="status">{status.message}</p> : null}
        <button className="button button-primary form-submit" disabled={sending}>{sending ? 'Enviando…' : 'Enviar mensaje'} <ArrowRight aria-hidden="true" /></button>
      </form>
    </section>
  )
}

function Field({ label, error, ...props }) {
  return <label className={error ? 'field has-error' : 'field'}><span>{label}</span><input {...props} aria-invalid={Boolean(error)} maxLength="160" />{error ? <small>{error}</small> : null}</label>
}
