import { Link } from "react-router-dom";
import { CalendarDays, Check, Circle } from "lucide-react";
import EstadoTarea from "./EstadoTarea";
import { useTareas } from "../context/TareasContext";

// tarjeta que se ve en la lista de inicio, resume una tarea
function TareaCard({ tarea }) {
  const { cambiarEstado } = useTareas();

  function marcarTarea(evento) {
    evento.preventDefault();
    evento.stopPropagation();
    cambiarEstado(tarea.id);
  }

  return (
    <Link
      to={`/tareas/${tarea.id}`}
      className={`tarjeta-tarea ${tarea.completada ? "completada" : "pendiente"}`}
    >
      <button
        type="button"
        className={`boton-completar ${tarea.completada ? "activo" : ""}`}
        onClick={marcarTarea}
        aria-label={tarea.completada ? "Marcar tarea como incompleta" : "Marcar tarea como completa"}
        title={tarea.completada ? "Marcar como incompleta" : "Marcar como completa"}
      >
        {tarea.completada ? <Check size={17} /> : <Circle size={17} />}
      </button>
      <div className="cuerpo-tarjeta">
        <h3>{tarea.titulo}</h3>
        {/* muestro la descripcion resumida, pero el texto original no cambia */}
        <p className="descripcion-corta">{tarea.descripcion}</p>
        <div className="meta-tarjeta">
          <EstadoTarea completada={tarea.completada} />
          <span className="d-flex align-items-center gap-1">
            <CalendarDays size={14} />
            {tarea.fechaCreacion}
          </span>
        </div>
      </div>
    </Link>
  );
}

export default TareaCard;
