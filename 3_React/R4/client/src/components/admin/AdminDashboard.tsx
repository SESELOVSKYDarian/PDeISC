import { useState } from 'react'
import { ExternalLink, LogOut, Moon, Sun } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext'
import { api } from '../../services/api'
import { ScrollTopButton } from '../common/ScrollTopButton'
import { ResourcePanel } from './ResourcePanel'
import { ProfilePanel } from './ProfilePanel'
import { MessagesPanel } from './MessagesPanel'
import { AccountPanel } from './AccountPanel'
import { resourceConfigs } from './resourceConfigs'
import type { AdminSession } from '../../types/admin'

const tabs: Array<[string, string]> = [
  ['perfil', 'Perfil'], ['proyectos', 'Proyectos'], ['categorias-habilidades', 'Categorías'], ['habilidades', 'Habilidades'],
  ['experiencias', 'Experiencias'], ['logros', 'Logros'], ['enlaces-sociales', 'Enlaces'], ['mensajes', 'Mensajes'], ['cuenta', 'Cuenta']
]

interface ActivePanelProps {
  active: string;
  admin: AdminSession;
  onAccountUpdated: (admin: AdminSession) => void;
}

// elijo el panel según la pestaña activa
function ActivePanel({ active, admin, onAccountUpdated }: ActivePanelProps) {
  if (active === 'perfil') return <ProfilePanel />
  if (active === 'mensajes') return <MessagesPanel />
  if (active === 'cuenta') return <AccountPanel admin={admin} onUpdated={onAccountUpdated} />
  return <ResourcePanel key={active} resource={active} config={resourceConfigs[active]} />
}

interface AdminDashboardProps {
  admin: AdminSession;
  onLogout: () => void;
  onAccountUpdated: (admin: AdminSession) => void;
}

export function AdminDashboard({ admin, onLogout, onAccountUpdated }: AdminDashboardProps) {
  const [active, setActive] = useState('perfil')
  const { theme, toggleTheme } = useTheme()

  const logout = async () => {
    await api.logout().catch(() => {})
    onLogout()
  }

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div><span className="wordmark">Portfolio<span>.</span></span><p>Panel de contenido</p></div>
        <nav aria-label="Secciones del panel">
          {tabs.map(([id, label]) => (
            <button key={id} className={active === id ? 'is-active' : ''} onClick={() => setActive(id)} aria-current={active === id ? 'page' : undefined}>{label}</button>
          ))}
        </nav>
        <div className="admin-user">
          <strong>{admin.nombre}</strong>
          <span>{admin.email}</span>
          <button onClick={logout}><LogOut /> Cerrar sesión</button>
        </div>
      </aside>
      <main className="admin-main">
        <header className="admin-topbar">
          <div><p className="eyebrow">Administración</p><h1>{tabs.find(([id]) => id === active)?.[1]}</h1></div>
          <div>
            <Link className="icon-button" to="/" target="_blank" aria-label="Ver portfolio"><ExternalLink /></Link>
            <button className="icon-button" onClick={toggleTheme} aria-label="Cambiar tema">{theme === 'dark' ? <Sun /> : <Moon />}</button>
          </div>
        </header>
        <ActivePanel active={active} admin={admin} onAccountUpdated={onAccountUpdated} />
      </main>
      <ScrollTopButton />
    </div>
  )
}
