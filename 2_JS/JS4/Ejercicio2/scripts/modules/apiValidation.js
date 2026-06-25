import { normalizeEmail } from "./normalizers.js";

function buildApiValidationResult(fieldErrors, message) {
  return {
    ok: false,
    fieldErrors,
    message
  };
}

export function checkUserAgainstApi(users, payload) {
  // reviso que no se repita el mail
  const normalizedEmail = normalizeEmail(payload.email);
  const emailExists = users.some((user) => user.email.toLowerCase() === normalizedEmail);

  if (emailExists) {
    return buildApiValidationResult(
      {
        email: "Ya hay un usuario con ese email en la API."
      },
      "Ya hay un usuario con ese email. Ingresa otro email para poder enviarlo."
    );
  }

  return {
    ok: true,
    fieldErrors: {},
    message: ""
  };
}
