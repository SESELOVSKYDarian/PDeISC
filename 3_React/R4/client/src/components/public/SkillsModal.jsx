import { useEffect, useRef } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { X } from 'lucide-react'

const easeOut = [0.23, 1, 0.32, 1]

export function SkillsModal({ category, onClose }) {
  const closeRef = useRef(null)
  const reduceMotion = useReducedMotion()
  useEffect(() => {
    if (!category) return undefined
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()
    const onKeyDown = (event) => { if (event.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [category, onClose])

  return (
    <AnimatePresence>
      {category ? (
        <motion.div className="skills-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25, ease: easeOut }} onMouseDown={onClose}>
          <motion.section className="skills-modal" role="dialog" aria-modal="true" aria-labelledby="skills-modal-title" initial={{ opacity: 0, transform: reduceMotion ? 'scale(1)' : 'scale(0.96)' }} animate={{ opacity: 1, transform: 'scale(1)' }} exit={{ opacity: 0, transform: reduceMotion ? 'scale(1)' : 'scale(0.96)' }} transition={{ duration: 0.25, ease: easeOut }} onMouseDown={(event) => event.stopPropagation()}>
            <div className="skills-modal-visual" style={{ backgroundImage: `linear-gradient(180deg, transparent, rgba(0,0,0,.78)), url(${category.imagen_url})` }}><p>Especialidad</p><h2 id="skills-modal-title">{category.nombre}</h2></div>
            <div className="skills-modal-content">
              <button ref={closeRef} className="icon-button skills-modal-close" onClick={onClose} aria-label="Cerrar detalle"><X /></button>
              <p className="eyebrow">Nivel actual</p>
              <div className="modal-skills">
                {category.habilidades.length ? category.habilidades.map((skill, index) => (
                  <article key={skill.id}>
                    <div><strong>{skill.nombre}</strong><span>{skill.nivel}%</span></div>
                    <div className="modal-skill-track"><motion.i initial={{ transform: 'scaleX(0)' }} animate={{ transform: `scaleX(${skill.nivel / 100})` }} transition={{ duration: reduceMotion ? 0.2 : 0.6, delay: reduceMotion ? 0 : index * 0.07, ease: easeOut }} /></div>
                  </article>
                )) : <p className="empty-modal">Todavía no hay habilidades cargadas en esta categoría.</p>}
              </div>
            </div>
          </motion.section>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
