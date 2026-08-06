import { useState } from "react";
import { Plus } from "lucide-react";
import {
  MAX_TASK_LENGTH,
  MIN_TASK_LENGTH,
  validateTask,
} from "../utils/tareas";

export default function FormularioTarea({ onAdd }) {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const handleChange = (event) => {
    const nextValue = event.target.value;
    setValue(nextValue);
    setError(validateTask(nextValue));
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    const message = validateTask(value);
    if (message) {
      setError(message);
      return;
    }
    const duplicateError = onAdd(value.trim());
    if (duplicateError) {
      setError(duplicateError);
      return;
    }
    setValue("");
    setError("");
  };
  // El formulario valida primero en React y luego entrega el texto limpio.
  return (
    <form onSubmit={handleSubmit} className="task-form">
      <label htmlFor="task">Nueva tarea</label>
      <div className="input-row">
        <input
          id="task"
          value={value}
          onChange={handleChange}
          required
          minLength={MIN_TASK_LENGTH}
          maxLength={MAX_TASK_LENGTH}
          aria-invalid={!!error}
          aria-describedby="task-error"
          placeholder="Ej.: Leer un capítulo"
        />
        <button type="submit" aria-label="Agregar tarea">
          <Plus />
        </button>
      </div>
      <small id="task-error" className="error">
        {error || " "}
      </small>
    </form>
  );
}
