import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import BotonSubir from "./BotonSubir";

// layout comun a todas las paginas: navbar arriba, contenido en el medio
// y el boton de subir flotando
function Layout() {
  return (
    <div>
      <Navbar />
      <main className="contenedor-app">
        <Outlet />
      </main>
      <BotonSubir />
    </div>
  );
}

export default Layout;
