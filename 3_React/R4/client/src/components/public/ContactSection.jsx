import { useState } from 'react'
import { ArrowRight, Mail } from 'lucide-react'
import { useToast } from '../../context/ToastContext.jsx'
import { api } from '../../services/api.js'
import { validateContact } from '../../utils/validation.js'

const initialValues = { nombre: '', email: '', asunto: '', mensaje: '' }
const SEND_HISTORY_KEY = 'portfolio_contact_send_history'
const EMAIL_COOLDOWN = 60 * 1000
const BROWSER_WINDOW = 10 * 60 * 1000
const BROWSER_LIMIT = 8

function checkBrowserSendLimit(email) {
  const now = Date.now()
  let history = []
  try { history = JSON.parse(localStorage.getItem(SEND_HISTORY_KEY) || '[]') } catch { history = [] }
  history = Array.isArray(history) ? history.filter((entry) => now - entry.at < BROWSER_WINDOW) : []
  const lastFromEmail = history.find((entry) => entry.email === email)
  if (lastFromEmail && now - lastFromEmail.at < EMAIL_COOLDOWN) {
    return 'Ese correo ya envió un mensaje recientemente. Esperá un minuto.'
  }
  if (history.length >= BROWSER_LIMIT) {
    return 'Se alcanzó el límite de envíos de este navegador. Intentá nuevamente más tarde.'
  }
  history.unshift({ email, at: now })
  try { localStorage.setItem(SEND_HISTORY_KEY, JSON.stringify(history.slice(0, BROWSER_LIMIT))) } catch { /* el servidor mantiene el límite */ }
  return ''
}

export function ContactSection({ profile }) {
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState({})
  const toast = useToast()
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
    const sendLimitError = checkBrowserSendLimit(values.email.trim().toLowerCase())
    if (sendLimitError) {
      toast.error(sendLimitError)
      return
    }
    setSending(true)
    try {
      const response = await api.contact(values)
      setValues(initialValues)
      toast.success(response.message)
    } catch (error) {
      setErrors(error.errors || {})
      toast.error(error.message)
    } finally { setSending(false) }
  }

  return (
    <section id="contacto" className="content-section section-anchor contact-section">
      <div className="contact-copy" data-reveal="left">
        <p className="eyebrow">Empecemos algo</p>
        <h2>¿Tenés una idea?<br /><span>Hagámosla realidad.</span></h2>
        <p>Contame qué necesitás. El mensaje queda guardado de forma segura para poder responderte.</p>
        <a href={`mailto:${profile.email}`}><Mail size={18} /> {profile.email}</a>
      </div>
      <form className="contact-form" onSubmit={submit} noValidate data-reveal="right" style={{ '--i': 1 }}>
        <Field label="Nombre" name="nombre" value={values.nombre} error={errors.nombre} onChange={update} autoComplete="name" />
        <Field label="Correo" name="email" type="email" value={values.email} error={errors.email} onChange={update} autoComplete="email" />
        <Field label="Asunto" name="asunto" value={values.asunto} error={errors.asunto} onChange={update} />
        <label className={errors.mensaje ? 'field has-error field-wide' : 'field field-wide'}>
          <span>Mensaje</span>
          <textarea name="mensaje" rows="5" value={values.mensaje} onChange={update} maxLength="2000" aria-invalid={Boolean(errors.mensaje)} />
          {errors.mensaje ? <small>{errors.mensaje}</small> : null}
        </label>
        <button className="button button-primary form-submit" disabled={sending}>{sending ? 'Enviando…' : 'Enviar mensaje'} <ArrowRight aria-hidden="true" /></button>
      </form>
    </section>
  )
}

function Field({ label, error, ...props }) {
  return (
    <label className={error ? 'field has-error' : 'field'}>
      <span>{label}</span>
      <input {...props} aria-invalid={Boolean(error)} maxLength="160" />
      {error ? <small>{error}</small> : null}
    </label>
  )
}
