import { useEffect, useState } from 'react'
import { api } from '../services/api.js'
import { AdminLogin } from '../components/admin/AdminLogin.jsx'
import { AdminDashboard } from '../components/admin/AdminDashboard.jsx'

export function AdminPage() {
  const [state, setState] = useState({ loading: true, admin: null })

  // al entrar pregunto si ya hay una sesión abierta
  useEffect(() => {
    api.session()
      .then((data) => setState({ loading: false, admin: data.admin }))
      .catch(() => setState({ loading: false, admin: null }))
  }, [])

  if (state.loading) {
    return <main className="state-page"><div className="loader" /><p>Verificando sesión…</p></main>
  }

  if (!state.admin) {
    return <AdminLogin onLogin={(admin) => setState({ loading: false, admin })} />
  }

  return <AdminDashboard admin={state.admin} onLogout={() => setState({ loading: false, admin: null })} />
}
