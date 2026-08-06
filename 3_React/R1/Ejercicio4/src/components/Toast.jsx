import { CheckCircle2 } from "lucide-react";
import { useEffect } from "react";

export default function Toast({ message, onClose }) {
  useEffect(() => {
    if (!message) return undefined;

    const timeoutId = window.setTimeout(onClose, 3000);
    return () => window.clearTimeout(timeoutId);
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div className="toast" role="status" aria-live="polite">
      <CheckCircle2 size={20} aria-hidden="true" />
      <span>{message}</span>
      <button type="button" onClick={onClose} aria-label="Cerrar notificación">
        ×
      </button>
    </div>
  );
}
