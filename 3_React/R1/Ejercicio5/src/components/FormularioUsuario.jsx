import { useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { UserRound } from "lucide-react";

const NAME_PATTERN =
  "^[A-Za-zÁÉÍÓÚÜáéíóúüÑñ]+(?:[ '-][A-Za-zÁÉÍÓÚÜáéíóúüÑñ]+)*$";

function validarNombre(value) {
  const name = value.trim();
  if (!name) return "El nombre es obligatorio.";
  if (name.length < 2) return "Escribí al menos 2 caracteres.";
  if (name.length > 60) return "Usá como máximo 60 caracteres.";
  if (!new RegExp(NAME_PATTERN).test(name)) {
    return "Usá solo letras, espacios, apóstrofes o guiones.";
  }
  return "";
}

const initialState = {
  error: "",
  welcome: "",
};

async function enviarNombre(previousState, formData) {
  const name = String(formData.get("name") ?? "");
  const error = validarNombre(name);

  if (error) {
    return { error, welcome: "" };
  }

  return {
    error: "",
    welcome: `¡Bienvenido, ${name.trim()}!`,
  };
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button type="submit" disabled={pending}>
      {pending ? "Ingresando..." : "Ingresar"}
    </button>
  );
}

export default function FormularioUsuario({ onWelcome }) {
  const [state, formAction] = useActionState(enviarNombre, initialState);

  useEffect(() => {
    if (state.welcome) onWelcome(state.welcome);
  }, [onWelcome, state.welcome]);

  return (
    <form className="form" action={formAction} noValidate>
      <div className="icon">
        <UserRound />
      </div>
      <h1>Conocé tu espacio</h1>
      <p className="intro">Escribí tu nombre para comenzar.</p>
      <label htmlFor="name">Nombre</label>
      <input
        id="name"
        name="name"
        required
        minLength="2"
        maxLength="60"
        pattern={NAME_PATTERN}
        aria-invalid={!!state.error}
        aria-describedby="name-error"
        autoComplete="name"
      />
      <small id="name-error" className="error">
        {state.error || " "}
      </small>
      <SubmitButton />
      {state.welcome && (
        <p className="welcome" aria-live="polite">
          {state.welcome}
        </p>
      )}
    </form>
  );
}
