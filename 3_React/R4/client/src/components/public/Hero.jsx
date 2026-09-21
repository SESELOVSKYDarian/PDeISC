import { ArrowDownRight, ArrowRight, Download, MapPin } from 'lucide-react'

export function Hero({ profile }) {
  return (
    <section id="inicio" className="hero section-anchor">
      <div className="hero-copy">
        <h1>{profile.saludo} {profile.nombre}.<br /><span>{profile.rol}</span> creando experiencias.</h1>
        <p className="hero-summary">{profile.presentacion}</p>
        <p className="location"><MapPin size={17} aria-hidden="true" /> {profile.ubicacion}</p>
        <div className="hero-actions">
          <button className="button button-primary" onClick={() => document.getElementById('proyectos')?.scrollIntoView({ behavior: 'smooth' })}>Ver proyectos <ArrowRight aria-hidden="true" /></button>
          <button className="button button-ghost" onClick={() => document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' })}>Hablemos <ArrowRight aria-hidden="true" /></button>
          {profile.cv_url ? <a className="button button-icon" href={profile.cv_url} download aria-label="Descargar currículum"><Download aria-hidden="true" /></a> : null}
        </div>
      </div>
      <div className="portrait-stage" aria-label="Retrato del autor">
        <div className="portrait-orbit" />
        <div className="portrait-glow" />
        <img src={profile.retrato_url} alt={`Retrato de ${profile.nombre}`} />
        <div className="hand-note">Código<br />Crear<br />Mejorar<br />Repetir</div>
        <ArrowDownRight className="sketch-arrow" aria-hidden="true" />
        <p className="vertical-motto">MEJORES IDEAS<br />UNA WEB MÁS CLARA</p>
      </div>
    </section>
  )
}
