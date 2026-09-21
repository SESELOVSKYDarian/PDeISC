import { ArrowUp } from 'lucide-react'
import { useScrollTop } from '../../hooks/useScrollTop.js'

// botón fijo para volver arriba de todo; aparece después de bajar un poco
export function ScrollTopButton() {
  const visible = useScrollTop()

  return (
    <button
      type="button"
      className={visible ? 'scroll-top is-visible' : 'scroll-top'}
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Volver arriba"
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
    >
      <ArrowUp />
    </button>
  )
}
