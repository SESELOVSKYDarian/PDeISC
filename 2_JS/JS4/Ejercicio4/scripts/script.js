import { viewConfig } from "./modules/config.js";
import { getViewElements, renderStudents, showStatus } from "./modules/dom.js";
import { getStudentsWithAxios, getStudentsWithFetch } from "./modules/api.js";

const views = {
  fetch: {
    ...viewConfig.fetch,
    ...getViewElements("fetch"),
    loader: getStudentsWithFetch
  },
  axios: {
    ...viewConfig.axios,
    ...getViewElements("axios"),
    loader: getStudentsWithAxios
  }
};

async function loadStudents(view) {
  showStatus(view.status, "Consultando la API propia...", "loading");

  try {
    // traigo los alumnos
    const students = await view.loader();

    // los renderizo en pantalla
    renderStudents(view.container, students);
    showStatus(view.status, view.successMessage, "success");
  } catch (error) {
    showStatus(view.status, error.message || view.errorMessage, "error");
  }
}

function bindLoadEvents(view) {
  // conecto cada boton con su llamada
  view.button.addEventListener("click", () => loadStudents(view));
}

// engancho los dos botones
Object.values(views).forEach(bindLoadEvents);
