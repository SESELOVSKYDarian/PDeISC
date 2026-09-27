import { useEffect, useRef } from 'react'
import { CircleAlert, CircleCheck, X } from 'lucide-react'
import type { Toast } from '../../types/toast'

interface ToastItemProps {
  toast: Toast;
  onClose: (id: number) => void;
}

// un aviso: se cierra solo, pero se queda quieto mientras el mouse o el teclado están encima
export function ToastItem({ toast, onClose }: ToastItemProps) {
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  const start = () => { timer.current = setTimeout(() => onClose(toast.id), toast.duration) }
  const stop = () => clearTimeout(timer.current)

  useEffect(() => {
    start()
    return stop
  }, [])

  const Icon = toast.type === 'error' ? CircleAlert : CircleCheck

  return (
    <div
      className={`toast toast-${toast.type}`}
      role={toast.type === 'error' ? 'alert' : undefined}
      onMouseEnter={stop}
      onMouseLeave={start}
      onFocus={stop}
      onBlur={start}
    >
      <Icon className="toast-icon" aria-hidden="true" />
      <p>{toast.message}</p>
      <button type="button" className="toast-close" onClick={() => onClose(toast.id)} aria-label="Cerrar aviso"><X aria-hidden="true" /></button>
    </div>
  )
}
