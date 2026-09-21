import { useEffect, useId, useRef } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'

const focusableSelector = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled])'

// ventana modal accesible: Escape la cierra, el foco queda adentro y el fondo no scrollea
export function AdminModal({ title, onClose, children }) {
  const dialog = useRef(null)
  const titleId = useId()

  useEffect(() => {
    const previous = document.activeElement
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const first = dialog.current.querySelector('.modal-body input, .modal-body select, .modal-body textarea')
    ;(first || dialog.current).focus()
    return () => {
      document.body.style.overflow = overflow
      previous?.focus?.()
    }
  }, [])

  const onKeyDown = (event) => {
    if (event.key === 'Escape') return onClose()
    if (event.key !== 'Tab') return
    // el Tab da la vuelta dentro de la ventana
    const items = [...dialog.current.querySelectorAll(focusableSelector)]
    const first = items[0]
    const last = items[items.length - 1]
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus() }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus() }
  }

  return createPortal(
    <div className="modal-backdrop">
      <div ref={dialog} className="modal-dialog" role="dialog" aria-modal="true" aria-labelledby={titleId} tabIndex={-1} onKeyDown={onKeyDown}>
        <header className="modal-header">
          <h3 id={titleId}>{title}</h3>
          <button type="button" className="icon-button" onClick={onClose} aria-label="Cerrar"><X /></button>
        </header>
        <div className="modal-body">{children}</div>
      </div>
    </div>,
    document.body
  )
}
