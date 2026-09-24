import { useState } from "react";
import { Link } from "react-router-dom";
import { CheckCheck, ClipboardList } from "lucide-react";
import { useTareas } from "../context/TareasContext";
import TareaCard from "../components/TareaCard";

// pagina principal, muestra todas las tareas guardadas
function Inicio() {
  const { tareas, marcarComoCompletadas, marcarTodasComoCompletadas } = useTareas();
  const [tareasSeleccionadas, setTareasSeleccionadas] = useState([]);

  const cantidadCompletas = tareas.filter((t) => t.completada).length;
  const tareasPendientes = tareas.filter((t) => !t.completada);
  const idsPendientesSeleccionados = tareasSeleccionadas.filter((id) =>
    tareas.some((tarea) => tarea.id === id && !tarea.completada)
  );

  function alternarSeleccion(id) {
    setTareasSeleccionadas((actuales) =>
      actuales.includes(id)
        ? actuales.filter((tareaId) => tareaId !== id)
        : [...actuales, id]
    );
  }

  function completarSeleccionadas() {
    marcarComoCompletadas(idsPendientesSeleccionados);
    setTareasSeleccionadas([]);
  }

  function completarTodas() {
    marcarTodasComoCompletadas();
    setTareasSeleccionadas([]);
  }

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
        <>
          {tareasPendientes.length > 0 && (
            <div className="acciones-lote" aria-label="Acciones para tareas">
              <span>
                {idsPendientesSeleccionados.length} seleccionada
                {idsPendientesSeleccionados.length === 1 ? "" : "s"}
              </span>
              <div className="d-flex flex-wrap gap-2">
                <button
                  type="button"
                  className="btn btn-outline-acento d-flex align-items-center gap-2"
                  disabled={idsPendientesSeleccionados.length === 0}
                  onClick={completarSeleccionadas}
                >
                  <CheckCheck size={16} />
                  Marcar seleccionadas como completadas
                </button>
                <button
                  type="button"
                  className="btn btn-acento"
                  onClick={completarTodas}
                >
                  Marcar todas como completadas
                </button>
              </div>
            </div>
          )}
          <div className="lista-tareas">
            {tareas.map((tarea) => (
              <TareaCard
                key={tarea.id}
                tarea={tarea}
                seleccionada={tareasSeleccionadas.includes(tarea.id)}
                onAlternarSeleccion={alternarSeleccion}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default Inicio;
