import { Award } from 'lucide-react'
import type { Achievement, Experience } from '../../types/portfolio'
import type { CSSVars } from '../../types/css'

interface ExperienceSectionProps {
  experiences: Experience[];
  achievements: Achievement[];
}

export function ExperienceSection({ experiences, achievements }: ExperienceSectionProps) {
  return (
    <section id="experiencia" className="content-section section-anchor">
      <div className="section-heading compact"><div data-reveal="up"><p className="eyebrow">Recorrido</p><h2>Experiencia y logros</h2></div></div>
      <div className="journey-grid">
        <div className="timeline">
          {experiences.map((item, index) => <article key={item.id} data-reveal="left" style={{ '--i': index } as CSSVars}><span>{item.periodo}</span><div><h3>{item.titulo}</h3><strong>{item.organizacion}</strong><p>{item.descripcion}</p></div></article>)}
        </div>
        <div className="achievement-list">
          {achievements.map((item, index) => <article key={item.id} data-reveal="right" style={{ '--i': index } as CSSVars}><Award aria-hidden="true" /><div><span>{item.fecha}</span><h3>{item.titulo}</h3><p>{item.descripcion}</p></div></article>)}
        </div>
      </div>
    </section>
  )
}
