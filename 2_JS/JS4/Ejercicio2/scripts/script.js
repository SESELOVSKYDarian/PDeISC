import { formsConfig } from "./modules/config.js";
import { bindForm } from "./modules/formHandlers.js";

// arranco la logica de los dos formularios
formsConfig.forEach(bindForm);
