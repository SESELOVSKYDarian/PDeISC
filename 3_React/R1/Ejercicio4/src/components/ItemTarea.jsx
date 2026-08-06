import { Check, Pencil, Trash2 } from "lucide-react";
import { formatTaskDate } from "../utils/tareas";

export default function ItemTarea({ task, onToggle, onEdit, onDelete }) {
  return (
    <li className={task.completada ? "done" : ""}>
      <button
        className="check"
        type="button"
        aria-label={task.completada ? "Desmarcar tarea" : "Marcar tarea"}
        onClick={() => onToggle(task.id)}
      >
        {task.completada && <Check size={16} strokeWidth={3} aria-hidden="true" />}
      </button>
      <div className="task-copy">
        <span>{task.texto}</span>
        <time>{formatTaskDate(task.fechaCreacion)}</time>
      </div>
      <button
        type="button"
        className="icon"
        aria-label="Editar tarea"
        onClick={() => onEdit(task)}
      >
        <Pencil />
      </button>
      <button
        type="button"
        className="icon danger"
        aria-label="Eliminar tarea"
        onClick={() => onDelete(task)}
      >
        <Trash2 />
      </button>
    </li>
  );
}
