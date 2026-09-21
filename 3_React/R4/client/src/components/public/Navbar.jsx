import { useEffect, useState } from 'react'
import { Menu, Moon, Sun, X } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext.jsx'

const links = [
  ['inicio', 'Inicio'], ['sobre-mi', 'Sobre mí'], ['proyectos', 'Proyectos'], ['experiencia', 'Experiencia'], ['contacto', 'Contacto']
]

export function Navbar({ active, name }) {
  const [open, setOpen] = useState(false)
  const { theme, toggleTheme } = useTheme()
  useEffect(() => {
    if (!open) return undefined
    const close = (event) => event.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', close)
    return () => window.removeEventListener('keydown', close)
  }, [open])

  const goTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setOpen(false)
  }

  return (
    <header className="site-header">
      <button className="wordmark" onClick={() => goTo('inicio')} aria-label="Volver al inicio">{name}<span>.</span></button>
      <nav className={open ? 'main-nav is-open' : 'main-nav'} aria-label="Navegación principal">
        {links.map(([id, label]) => (
          <button key={id} className={active === id ? 'nav-link is-active' : 'nav-link'} onClick={() => goTo(id)}>{label}</button>
        ))}
      </nav>
      <div className="header-actions">
        <button className="icon-button" onClick={toggleTheme} aria-label={`Cambiar a modo ${theme === 'dark' ? 'claro' : 'oscuro'}`}>
          {theme === 'dark' ? <Sun aria-hidden="true" /> : <Moon aria-hidden="true" />}
        </button>
        <button className="icon-button menu-button" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-label={open ? 'Cerrar menú' : 'Abrir menú'}>
          {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
      </div>
    </header>
  )
}
