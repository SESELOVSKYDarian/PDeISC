import { useState } from 'react'
import { ExternalLink } from 'lucide-react'
import { FlowingMenu, type FlowMenuItem } from './FlowingMenu'
import { SkillsModal } from './SkillsModal'
import type { Profile, SkillCategory, SocialLink } from '../../types/portfolio'
import type { CSSVars } from '../../types/css'

interface AboutSectionProps {
  profile: Profile;
  categories: SkillCategory[];
  socialLinks: SocialLink[];
}

export function AboutSection({ profile, categories, socialLinks }: AboutSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<SkillCategory | null>(null)
  const items: FlowMenuItem[] = categories.map((category) => ({ id: category.id, text: category.nombre, image: category.imagen_url, category }))
  return (
    <section id="sobre-mi" className="content-section section-anchor about-section">
      <div className="section-heading about-heading">
        <div data-reveal="left"><p className="eyebrow">Perfil / capacidades</p><h2>Sobre mí</h2></div>
        <div className="about-intro" data-reveal="right" style={{ '--i': 1 } as CSSVars}>
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
