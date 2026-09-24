import { Link } from "react-router-dom";
import { CalendarDays, Check, Circle } from "lucide-react";
import { useTareas } from "../context/TareasContext";

// tarjeta que se ve en la lista de inicio, resume una tarea
function TareaCard({ tarea }) {
  const { cambiarEstadoTarea } = useTareas();

  function alternarEstado(evento) {
    evento.stopPropagation();
    cambiarEstadoTarea(tarea.id, !tarea.completada);
  }

  return (
    <Link
      to={`/tareas/${tarea.id}`}
      className={`tarjeta-tarea ${tarea.completada ? "completada" : "pendiente"}`}
    >
      <div className="cuerpo-tarjeta">
        <h3>{tarea.titulo}</h3>
        {/* muestro la descripcion resumida, pero el texto original no cambia */}
        <p className="descripcion-corta">{tarea.descripcion}</p>
        <div className="meta-tarjeta">
          <span className="d-flex align-items-center gap-1">
            <CalendarDays size={14} />
            {tarea.fechaCreacion}
          </span>
          <button
            type="button"
            className={`boton-estado ${tarea.completada ? "completada" : "pendiente"}`}
            onClick={alternarEstado}
            aria-pressed={tarea.completada}
            aria-label={`${tarea.completada ? "Volver incompleta" : "Marcar como completa"}: ${tarea.titulo}`}
          >
            {tarea.completada ? <Check size={14} /> : <Circle size={14} />}
            {tarea.completada ? "Completa" : "Incompleta"}
          </button>
        </div>
      </div>
    </Link>
  );
}

export default TareaCard;
