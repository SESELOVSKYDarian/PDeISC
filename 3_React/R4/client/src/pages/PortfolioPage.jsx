import { ArrowUp, RotateCcw } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Navbar } from '../components/public/Navbar.jsx'
import { Hero } from '../components/public/Hero.jsx'
import { AboutSection } from '../components/public/AboutSection.jsx'
import { ProjectsSection } from '../components/public/ProjectsSection.jsx'
import { ExperienceSection } from '../components/public/ExperienceSection.jsx'
import { ContactSection } from '../components/public/ContactSection.jsx'
import { usePortfolio } from '../hooks/usePortfolio.js'
import { useActiveSection } from '../hooks/useActiveSection.js'
import { useReveal } from '../hooks/useReveal.js'
import { useScrollTop } from '../hooks/useScrollTop.js'

const sectionIds = ['inicio', 'sobre-mi', 'proyectos', 'experiencia', 'contacto']

export function PortfolioPage() {
  const { data, loading, error, reload } = usePortfolio()
  const active = useActiveSection(sectionIds, Boolean(data?.profile))
  const showScrollTop = useScrollTop()
  useReveal(data)

  if (loading) return <main className="state-page"><div className="loader" /><p>Cargando portfolio…</p></main>
  if (error || !data?.profile) return <main className="state-page"><p className="eyebrow">Sin conexión</p><h1>No pudimos cargar el portfolio.</h1><p>{error}</p><button className="button button-primary" onClick={reload}><RotateCcw /> Reintentar</button></main>

  return (
    <div className="page-shell">
      <Navbar active={active} name={data.profile.nombre.split(' ')[0]} />
      <main>
        <Hero profile={data.profile} />
        <AboutSection profile={data.profile} categories={data.skillCategories} socialLinks={data.socialLinks} />
        <ProjectsSection projects={data.projects} />
        <ExperienceSection experiences={data.experiences} achievements={data.achievements} />
        <ContactSection profile={data.profile} />
      </main>
      <footer><p>© {new Date().getFullYear()} {data.profile.nombre}. Hecho con React, café y atención al detalle.</p><Link to="/admin">Administrar</Link></footer>
      <button className={showScrollTop ? 'scroll-top is-visible' : 'scroll-top'} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="Volver arriba"><ArrowUp /></button>
    </div>
  )
}
