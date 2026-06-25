import { checkUserAgainstApi } from "./apiValidation.js";
import { getFields, paintErrors, clearFieldState, showStatus } from "./dom.js";
import { validateOnBackend } from "./services/api.js";
import { validateFields } from "./validators.js";

async function validateAgainstApi(formConfig, payload) {
  // reviso si el usuario existe en la api
  const users = await formConfig.usersLoader();
  const apiValidation = checkUserAgainstApi(users, payload);

  if (!apiValidation.ok) {
    paintErrors(formConfig.prefix, apiValidation.fieldErrors);
  }

  return apiValidation;
}

function resetFormState(formConfig) {
  // limpio el formulario despues del exito
  formConfig.form.reset();
  clearFieldState(formConfig.prefix);
  validateFields(formConfig.prefix);
}

function clearForm(formConfig) {
  // limpio lo que el usuario escribio
  formConfig.form.reset();
  clearFieldState(formConfig.prefix);
  showStatus(formConfig.status, "Formulario limpio. Ya puedes volver a empezar.", "success");
}

async function handleSubmit(formConfig) {
  const { isValid, payload } = validateFields(formConfig.prefix);

  if (!isValid) {
    showStatus(formConfig.status, "Corrige los campos marcados antes de enviar.", "error");
    return;
  }

  showStatus(formConfig.status, "Validando datos y enviando informacion...", "loading");

  try {
    // primero controlo que el mail no este repetido en la api publica
    const apiValidation = await validateAgainstApi(formConfig, payload);

    if (!apiValidation.ok) {
      showStatus(formConfig.status, apiValidation.message, "error");
      return;
    }

    // despues valido contra mi backend
    const cleanPayload = await validateOnBackend(payload);

    // y recien ahi hago el post final
    const result = await formConfig.submitter(cleanPayload);

    showStatus(
      formConfig.status,
      `Usuario enviado correctamente. ID devuelto por el POST: <strong>${result.id}</strong>`,
      "success"
    );

    resetFormState(formConfig);
  } catch (error) {
    showStatus(formConfig.status, error.message, "error");
  }
}

export function bindForm(formConfig) {
  const formFields = getFields(formConfig.prefix);

  // engancho validacion en vivo
  formFields.name.addEventListener("input", () => validateFields(formConfig.prefix));
  formFields.email.addEventListener("input", () => validateFields(formConfig.prefix));
  formFields.name.addEventListener("blur", () => validateFields(formConfig.prefix));
  formFields.email.addEventListener("blur", () => validateFields(formConfig.prefix));

  // engancho el submit del formulario
  formConfig.form.addEventListener("submit", async (event) => {
    event.preventDefault();
    await handleSubmit(formConfig);
  });

  // engancho el boton de limpiar
  formFields.clearButton.addEventListener("click", () => clearForm(formConfig));
}
