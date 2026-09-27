import { ToastItem } from './ToastItem'
import type { Toast } from '../../types/toast'

interface ToasterProps {
  toasts: Toast[];
  onClose: (id: number) => void;
}

// contenedor fijo abajo al centro; es una región "en vivo" para que los lectores de pantalla lean los avisos sin mover el foco
export function Toaster({ toasts, onClose }: ToasterProps) {
  return (
    <div className="toaster" aria-live="polite" aria-label="Notificaciones">
      {toasts.map((toast) => <ToastItem key={toast.id} toast={toast} onClose={onClose} />)}
    </div>
  )
}
