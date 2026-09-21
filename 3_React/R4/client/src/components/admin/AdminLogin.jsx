import { useState } from 'react'
import { ArrowLeft, Eye, EyeOff, LockKeyhole } from 'lucide-react'
import { Link } from 'react-router-dom'
import { api } from '../../services/api.js'

export function AdminLogin({ onLogin }) {
  const [values, setValues] = useState({ email: '', password: '' })
  const [visible, setVisible] = useState(false)
  const [status, setStatus] = useState({ loading: false, error: '' })
  const submit = async (event) => {
    event.preventDefault()
    setStatus({ loading: true, error: '' })
    try {
      const response = await api.login(values)
      onLogin(response.admin)
    } catch (error) {
      setStatus({ loading: false, error: error.message })
    }
  }
  return (
    <main className="admin-login-page">
      <Link className="back-link" to="/"><ArrowLeft size={17} /> Volver al portfolio</Link>
      <form className="login-card" onSubmit={submit}>
        <div className="login-icon"><LockKeyhole /></div>
        <p className="eyebrow">Área privada</p><h1>Panel administrador</h1><p>Editá el portfolio y revisá los mensajes recibidos.</p>
        <label className="field"><span>Correo</span><input type="email" value={values.email} onChange={(event) => setValues({ ...values, email: event.target.value })} autoComplete="username" required /></label>
        <label className="field"><span>Contraseña</span><div className="password-input"><input type={visible ? 'text' : 'password'} value={values.password} onChange={(event) => setValues({ ...values, password: event.target.value })} autoComplete="current-password" minLength="8" required /><button type="button" onClick={() => setVisible((value) => !value)} aria-label={visible ? 'Ocultar contraseña' : 'Mostrar contraseña'}>{visible ? <EyeOff /> : <Eye />}</button></div></label>
        {status.error ? <p className="form-status error" role="alert">{status.error}</p> : null}
        <button className="button button-primary login-submit" disabled={status.loading}>{status.loading ? 'Ingresando…' : 'Ingresar'}</button>
      </form>
    </main>
  )
}
