import { useEffect } from "react";
import { X } from "lucide-react";

export default function ModalTarea({ title, onClose, children }) {
  useEffect(() => {
    // Escape cierra el modal sin modificar la tarea.
    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
      <section
        className="task-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="task-modal-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="modal-header">
          <h2 id="task-modal-title">{title}</h2>
          <button
            className="modal-close"
            type="button"
            aria-label="Cerrar modal"
            onClick={onClose}
          >
            <X />
          </button>
        </div>
        {children}
      </section>
    </div>
  );
}
