import { useState, type PointerEvent } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import type { SkillCategory } from '../../types/portfolio'
import type { CSSVars } from '../../types/css'

export interface FlowMenuItem {
  id: number;
  text: string;
  image: string;
  category: SkillCategory;
}

const easeOut: [number, number, number, number] = [0.23, 1, 0.32, 1]

interface FlowingMenuProps {
  items: FlowMenuItem[];
  onSelect: (item: FlowMenuItem) => void;
}

export function FlowingMenu({ items, onSelect }: FlowingMenuProps) {
  return (
    <nav className="flow-menu" aria-label="Categorías de habilidades">
      {items.map((item, index) => <FlowingMenuItem key={item.id} item={item} index={index} onSelect={onSelect} />)}
    </nav>
  )
}

interface FlowingMenuItemProps {
  item: FlowMenuItem;
  index: number;
  onSelect: (item: FlowMenuItem) => void;
}

interface HoverState {
  active: boolean;
  edge: 'top' | 'bottom';
}

function FlowingMenuItem({ item, index, onSelect }: FlowingMenuItemProps) {
  const [hover, setHover] = useState<HoverState>({ active: false, edge: 'bottom' })
  const reduceMotion = useReducedMotion()
  const enter = (event: PointerEvent<HTMLButtonElement>) => {
    if (event.pointerType !== 'mouse') return
    const bounds = event.currentTarget.getBoundingClientRect()
    setHover({ active: true, edge: event.clientY - bounds.top < bounds.height / 2 ? 'top' : 'bottom' })
  }
  const leave = (event: PointerEvent<HTMLButtonElement>) => {
    if (event.pointerType === 'mouse') setHover((current) => ({ ...current, active: false }))
  }
  const offset = hover.edge === 'top' ? '-101%' : '101%'
  return (
    <div className="flow-menu-item" data-reveal="wipe" style={{ '--i': index } as CSSVars}>
      <button type="button" className="flow-menu-trigger" onClick={() => onSelect(item)} onPointerEnter={enter} onPointerLeave={leave} onFocus={() => setHover({ active: true, edge: 'bottom' })} onBlur={() => setHover((current) => ({ ...current, active: false }))} aria-haspopup="dialog">
        <span>{item.text}</span><small>Ver habilidades</small>
      </button>
      <AnimatePresence>
        {hover.active ? (
          <motion.div className="flow-marquee" initial={{ opacity: 0, transform: reduceMotion ? 'translateY(0)' : `translateY(${offset})` }} animate={{ opacity: 1, transform: 'translateY(0)' }} exit={{ opacity: 0, transform: reduceMotion ? 'translateY(0)' : `translateY(${offset})` }} transition={{ duration: 0.25, ease: easeOut }} aria-hidden="true">
            <motion.div className="flow-marquee-track" animate={{ transform: reduceMotion ? 'translateX(0)' : 'translateX(-50%)' }} transition={{ duration: 15, ease: 'linear', repeat: Infinity }}>
              <MarqueePart item={item} /><MarqueePart item={item} />
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}

function MarqueePart({ item }: { item: FlowMenuItem }) {
  return <div className="flow-marquee-part"><span>{item.text}</span><div className="flow-marquee-image" style={{ backgroundImage: `url(${item.image})` }} /></div>
}
