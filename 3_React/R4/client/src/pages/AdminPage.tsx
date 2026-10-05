import { useEffect, useState } from 'react'
import { api } from '../services/api'
import { AdminLogin } from '../components/admin/AdminLogin'
import { AdminDashboard } from '../components/admin/AdminDashboard'
import type { AdminSession } from '../types/admin'

interface AdminPageState {
  loading: boolean;
  admin: AdminSession | null;
}

export function AdminPage() {
  const [state, setState] = useState<AdminPageState>({ loading: true, admin: null })

  // al entrar pregunto si ya hay una sesión abierta
  useEffect(() => {
    api.session()
      .then((data: any) => setState({ loading: false, admin: data.admin }))
      .catch(() => setState({ loading: false, admin: null }))
  }, [])

  if (state.loading) {
    return <main className="state-page"><div className="loader" /><p>Verificando sesión…</p></main>
  }

  if (!state.admin) {
    return <AdminLogin onLogin={(admin) => setState({ loading: false, admin })} />
  }

  return (
    <AdminDashboard
      admin={state.admin}
      onLogout={() => setState({ loading: false, admin: null })}
      onAccountUpdated={(admin) => setState({ loading: false, admin })}
    />
  )
}
