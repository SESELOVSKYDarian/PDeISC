import { viewConfig } from "./modules/config.js";
import { getViewElements, showStatus, clearContainer } from "./modules/dom.js";
import { getUsersWithAxios, getUsersWithFetch } from "./modules/api.js";
import { renderUsers } from "./modules/render.js";

const views = {
  fetch: {
    ...viewConfig.fetch,
    ...getViewElements("fetch")
  },
  axios: {
    ...viewConfig.axios,
    ...getViewElements("axios")
  }
};

function loadUsers(view) {
  return async () => {
    showStatus(view.status, "Cargando usuarios...", "loading");
    clearContainer(view.container);

    try {
      // traigo los datos segun la version
      const users = await view.loader();

      // los muestro en pantalla
      renderUsers(view.container, users);
      showStatus(view.status, view.successMessage, "success");
    } catch (error) {
      showStatus(view.status, error.message || view.errorMessage, "error");
    }
  };
}

function bindView(view) {
  // conecto cada boton con su bloque
  view.button.addEventListener("click", loadUsers(view));
}

views.fetch.loader = getUsersWithFetch;
views.axios.loader = getUsersWithAxios;

// engancho las dos implementaciones
Object.values(views).forEach(bindView);
