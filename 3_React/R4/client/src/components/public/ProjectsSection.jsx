import { ArrowUpRight, Github } from 'lucide-react'

export function ProjectsSection({ projects }) {
  return (
    <section id="proyectos" className="content-section section-anchor projects-section">
      <div className="section-heading">
        <div data-reveal="up"><p className="eyebrow">Trabajo destacado</p><h2>Proyectos seleccionados</h2></div>
        <p data-reveal="up" style={{ '--i': 1 }}>Una colección de productos construidos para aprender, resolver problemas y mejorar con cada iteración.</p>
      </div>
      <div className="project-grid">
        {projects.map((project, index) => (
          <article className="project-card" key={project.id} data-reveal="zoom" style={{ '--i': index }}>
            <div className="project-image"><img src={project.imagen_url} alt="" loading="lazy" /></div>
            <div className="project-number">{String(index + 1).padStart(2, '0')}</div>
            <h3>{project.titulo}</h3><p>{project.resumen}</p>
            <div className="tags">{project.tecnologias.map((technology) => <span key={technology}>{technology}</span>)}</div>
            <div className="project-links">
              {project.demo_url ? <a href={project.demo_url} target="_blank" rel="noreferrer">Demo <ArrowUpRight size={17} /></a> : <span>Próximamente</span>}
              {project.repo_url ? <a href={project.repo_url} target="_blank" rel="noreferrer" aria-label={`Código de ${project.titulo}`}><Github size={18} /></a> : null}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
