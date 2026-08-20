import { Link } from "react-router-dom";
import { ClipboardList } from "lucide-react";
import { useTareas } from "../context/TareasContext";
import TareaCard from "../components/TareaCard";

// pagina principal, muestra todas las tareas guardadas
function Inicio() {
  const { tareas } = useTareas();

  const cantidadCompletas = tareas.filter((t) => t.completada).length;

  return (
    <div>
      <div className="encabezado-pagina">
        <div>
          <h1>Mis tareas</h1>
          <p>
            {tareas.length === 0
              ? "Todavia no cargaste ninguna tarea."
              : `Tenes ${cantidadCompletas} de ${tareas.length} tareas completadas.`}
          </p>
        </div>
      </div>

      {tareas.length === 0 ? (
        <div className="estado-vacio">
          <ClipboardList size={40} style={{ marginBottom: "0.75rem" }} />
          <h3>Todavia no hay tareas</h3>
          <p>Crea la primera para empezar a organizarte.</p>
          <Link to="/crear" className="btn btn-acento">
            Crear tarea
          </Link>
        </div>
      ) : (
        <div className="lista-tareas">
          {tareas.map((tarea) => (
            <TareaCard key={tarea.id} tarea={tarea} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Inicio;
