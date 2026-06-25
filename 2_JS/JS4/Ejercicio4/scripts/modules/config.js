export const viewConfig = {
  fetch: {
    buttonSelector: "#fetch-button",
    statusSelector: "#fetch-status",
    containerSelector: "#fetch-students",
    successMessage: "Alumnos cargados correctamente con fetch.",
    errorMessage: "No se pudo obtener la lista de alumnos con fetch."
  },
  axios: {
    buttonSelector: "#axios-button",
    statusSelector: "#axios-status",
    containerSelector: "#axios-students",
    successMessage: "Alumnos cargados correctamente con axios.",
    errorMessage: "No se pudo obtener la lista de alumnos con axios."
  }
};
