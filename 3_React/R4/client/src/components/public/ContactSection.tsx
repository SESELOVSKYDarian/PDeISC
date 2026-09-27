import { useState, type ChangeEvent, type FormEvent, type InputHTMLAttributes } from 'react'
import { ArrowRight, Mail } from 'lucide-react'
import { useToast } from '../../context/ToastContext'
import { api } from '../../services/api'
import { validateContact, type ContactErrors, type ContactValues } from '../../utils/validation'
import type { Profile } from '../../types/portfolio'
import type { ApiError } from '../../services/api'
import type { CSSVars } from '../../types/css'

const initialValues: ContactValues = { nombre: '', email: '', asunto: '', mensaje: '' }
const SEND_HISTORY_KEY = 'portfolio_contact_send_history'
const EMAIL_COOLDOWN = 60 * 1000
const BROWSER_WINDOW = 10 * 60 * 1000
const BROWSER_LIMIT = 8

interface SendHistoryEntry {
  email: string;
  at: number;
}

function checkBrowserSendLimit(email: string): string {
  const now = Date.now()
  let history: SendHistoryEntry[] = []
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

export function ContactSection({ profile }: { profile: Profile }) {
  const [values, setValues] = useState<ContactValues>(initialValues)
  const [errors, setErrors] = useState<ContactErrors>({})
  const toast = useToast()
  const [sending, setSending] = useState(false)

  const update = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target
    setValues((current) => ({ ...current, [name]: value }))
    if (errors[name as keyof ContactErrors]) setErrors((current) => ({ ...current, [name]: '' }))
  }
  const submit = async (event: FormEvent) => {
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
      const response = await api.contact(values) as { message: string }
      setValues(initialValues)
      toast.success(response.message)
    } catch (error) {
      const apiError = error as ApiError
      setErrors(apiError.errors || {})
      toast.error(apiError.message)
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
      <form className="contact-form" onSubmit={submit} noValidate data-reveal="right" style={{ '--i': 1 } as CSSVars}>
        <Field label="Nombre" name="nombre" value={values.nombre} error={errors.nombre} onChange={update} autoComplete="name" />
        <Field label="Correo" name="email" type="email" value={values.email} error={errors.email} onChange={update} autoComplete="email" />
        <Field label="Asunto" name="asunto" value={values.asunto} error={errors.asunto} onChange={update} />
        <label className={errors.mensaje ? 'field has-error field-wide' : 'field field-wide'}>
          <span>Mensaje</span>
          <textarea name="mensaje" rows={5} value={values.mensaje} onChange={update} maxLength={2000} aria-invalid={Boolean(errors.mensaje)} />
          {errors.mensaje ? <small>{errors.mensaje}</small> : null}
        </label>
        <button className="button button-primary form-submit" disabled={sending}>{sending ? 'Enviando…' : 'Enviar mensaje'} <ArrowRight aria-hidden="true" /></button>
      </form>
    </section>
  )
}

interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

function Field({ label, error, ...props }: FieldProps) {
  return (
    <label className={error ? 'field has-error' : 'field'}>
      <span>{label}</span>
      <input {...props} aria-invalid={Boolean(error)} maxLength={160} />
      {error ? <small>{error}</small> : null}
    </label>
  )
}
