import { useState } from 'react'
import { ExternalLink } from 'lucide-react'
import { FlowingMenu } from './FlowingMenu.jsx'
import { SkillsModal } from './SkillsModal.jsx'

export function AboutSection({ profile, categories, socialLinks }) {
  const [selectedCategory, setSelectedCategory] = useState(null)
  const items = categories.map((category) => ({ id: category.id, text: category.nombre, image: category.imagen_url, category }))
  return (
    <section id="sobre-mi" className="content-section section-anchor about-section">
      <div className="section-heading about-heading">
        <div data-reveal="left"><p className="eyebrow">Perfil / capacidades</p><h2>Sobre mí</h2></div>
        <div className="about-intro" data-reveal="right" style={{ '--i': 1 }}>
          <p>{profile.descripcion}</p>
          <div className="about-meta"><span className="status-dot" /><strong>{profile.disponibilidad}</strong></div>
          <div className="about-links">
            {socialLinks.map((link) => <a key={link.id} href={link.url} target="_blank" rel="noreferrer">{link.nombre}<ExternalLink size={15} aria-hidden="true" /></a>)}
          </div>
        </div>
      </div>
      <FlowingMenu items={items} onSelect={(item) => setSelectedCategory(item.category)} />
      <SkillsModal category={selectedCategory} onClose={() => setSelectedCategory(null)} />
    </section>
  )
}
