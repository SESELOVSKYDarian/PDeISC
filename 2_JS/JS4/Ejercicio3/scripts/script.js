import { viewConfig } from "./modules/config.js";
import { getViewElements, renderUsers, showStatus } from "./modules/dom.js";
import { getUsersWithAxios, getUsersWithFetch } from "./modules/api.js";
import { saveUsers, getSavedUsers } from "./modules/state.js";
import { filterUsers } from "./modules/search.js";

const views = {
  fetch: {
    ...viewConfig.fetch,
    ...getViewElements("fetch"),
    loader: getUsersWithFetch,
    stateKey: "fetchUsers"
  },
  axios: {
    ...viewConfig.axios,
    ...getViewElements("axios"),
    loader: getUsersWithAxios,
    stateKey: "axiosUsers"
  }
};

function renderSearchResults(view, searchValue) {
  // filtro sobre el array guardado
  const filteredUsers = filterUsers(getSavedUsers(view.stateKey), searchValue);
  renderUsers(view.results, filteredUsers);
}

async function loadUsers(view) {
  showStatus(view.status, "Cargando usuarios...", "loading");

  try {
    // hago la consulta inicial
    const users = await view.loader();

    saveUsers(view.stateKey, users);
    view.input.disabled = false;
    renderUsers(view.results, users);
    showStatus(view.status, view.successMessage, "success");
  } catch (error) {
    showStatus(view.status, error.message || view.errorMessage, "error");
  }
}

function bindView(view) {
  // cargo la lista al tocar el boton
  view.button.addEventListener("click", () => loadUsers(view));

  // filtro en vivo sin volver a pedir datos
  view.input.addEventListener("input", (event) => {
    renderSearchResults(view, event.target.value);
  });
}

// engancho las dos implementaciones
Object.values(views).forEach(bindView);
