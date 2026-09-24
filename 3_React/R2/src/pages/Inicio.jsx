import { Link } from "react-router-dom";
import { CheckCheck, ClipboardList, RotateCcw } from "lucide-react";
import { useTareas } from "../context/TareasContext";
import TareaCard from "../components/TareaCard";

// pagina principal, muestra todas las tareas guardadas
function Inicio() {
  const { tareas, alternarEstadoTodas } = useTareas();
  const cantidadCompletas = tareas.filter((tarea) => tarea.completada).length;
  const todasCompletadas = tareas.length > 0 && cantidadCompletas === tareas.length;

  return (
    <div>
      <div className="encabezado-pagina">
        <div>
          <h1>Mis tareas</h1>
          <p>
            {tareas.length === 0
              ? "Todavía no cargaste ninguna tarea."
              : `Tenés ${cantidadCompletas} de ${tareas.length} tareas completadas.`}
          </p>
        </div>
      </div>

      {tareas.length === 0 ? (
        <div className="estado-vacio">
          <ClipboardList size={40} style={{ marginBottom: "0.75rem" }} />
          <h3>Todavía no hay tareas</h3>
          <p>Creá la primera para empezar a organizarte.</p>
          <Link to="/crear" className="btn btn-acento">
            Crear tarea
          </Link>
        </div>
      ) : (
        <>
          <div className="acciones-lote" aria-label="Acciones para tareas">
            <span>
              {todasCompletadas
                ? "Todas las tareas están completadas."
                : "Hay tareas pendientes por completar."}
            </span>
            <button
              type="button"
              className="btn btn-acento d-flex align-items-center gap-2"
              onClick={alternarEstadoTodas}
            >
              {todasCompletadas ? <RotateCcw size={16} /> : <CheckCheck size={16} />}
              {todasCompletadas
                ? "Marcar todas como incompletas"
                : "Marcar todas como completadas"}
            </button>
          </div>

          <div className="lista-tareas">
            {tareas.map((tarea) => (
              <TareaCard key={tarea.id} tarea={tarea} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default Inicio;
