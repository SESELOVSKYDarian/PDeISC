import { useNavigate } from "react-router-dom";
import { useTareas } from "../context/TareasContext";
import FormularioTarea from "../components/FormularioTarea";

// pagina para crear una tarea nueva
function CrearTarea() {
  const { agregarTarea } = useTareas();
  const navigate = useNavigate();

  function manejarGuardar(datos) {
    const tareaCreada = agregarTarea(datos);
    // despues de crearla, la muestro directamente en su pagina de detalle
    navigate(`/tareas/${tareaCreada.id}`);
  }

  return (
    <div>
      <div className="encabezado-pagina">
        <div>
          <h1>Nueva tarea</h1>
          <p>Completa los datos para agregarla a tu lista.</p>
        </div>
      </div>

      <div className="tarjeta-formulario">
        <FormularioTarea onGuardar={manejarGuardar} textoBoton="Crear tarea" />
      </div>
    </div>
  );
}

export default CrearTarea;
