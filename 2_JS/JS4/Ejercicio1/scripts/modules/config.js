export const viewConfig = {
  fetch: {
    buttonSelector: "#fetch-button",
    statusSelector: "#fetch-status",
    containerSelector: "#fetch-users",
    successMessage: "Usuarios cargados correctamente con fetch.",
    errorMessage: "No se pudo obtener la lista con fetch."
  },
  axios: {
    buttonSelector: "#axios-button",
    statusSelector: "#axios-status",
    containerSelector: "#axios-users",
    successMessage: "Usuarios cargados correctamente con axios.",
    errorMessage: "No se pudo obtener la lista con axios."
  }
};
