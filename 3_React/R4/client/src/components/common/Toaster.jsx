import { ToastItem } from './ToastItem.jsx'

// contenedor fijo abajo al centro; es una región "en vivo" para que los lectores de pantalla lean los avisos sin mover el foco
export function Toaster({ toasts, onClose }) {
  return (
    <div className="toaster" aria-live="polite" aria-label="Notificaciones">
      {toasts.map((toast) => <ToastItem key={toast.id} toast={toast} onClose={onClose} />)}
    </div>
  )
}
