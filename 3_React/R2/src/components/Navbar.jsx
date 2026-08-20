import { NavLink } from "react-router-dom";
import { ListChecks, Plus } from "lucide-react";
import BotonTema from "./BotonTema";

// barra de navegacion de toda la app, se muestra en todas las paginas
function Navbar() {
  return (
    <nav className="navbar navbar-app navbar-expand-md sticky-top">
      <div className="container-fluid contenedor-app py-2">
        <NavLink to="/" className="navbar-brand">
          <ListChecks size={22} />
          Mis Tareas
        </NavLink>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#menuPrincipal"
          aria-controls="menuPrincipal"
          aria-expanded="false"
          aria-label="Abrir menu de navegacion"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="menuPrincipal">
          <div className="navbar-nav me-auto mb-2 mb-md-0" />

          <div className="d-flex align-items-center gap-2">
            <NavLink to="/crear" className="btn btn-acento btn-nueva-tarea d-flex align-items-center gap-2">
              <Plus size={16} />
              Nueva tarea
            </NavLink>
            <BotonTema />
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
