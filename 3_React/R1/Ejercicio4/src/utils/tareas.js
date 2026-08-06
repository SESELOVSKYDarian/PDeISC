export const MIN_TASK_LENGTH = 3;
export const MAX_TASK_LENGTH = 80;

export const initialTasks = [
  {
    id: crypto.randomUUID(),
    texto: "Repasar componentes de React",
    completada: false,
    fechaCreacion: new Date(),
  },
  {
    id: crypto.randomUUID(),
    texto: "Practicar useState",
    completada: true,
    fechaCreacion: new Date(),
  },
];

export function formatTaskDate(date) {
  // La consigna pide una fecha corta: día/mes/año.
  return new Date(date).toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  });
}

export function validateTask(value) {
  // Esta regla se comparte entre alta y edición para evitar validaciones distintas.
  const text = value.trim();
  if (!text) return "Escribí una tarea.";
  if (text.length < MIN_TASK_LENGTH)
    return `Usá al menos ${MIN_TASK_LENGTH} caracteres.`;
  if (text.length > MAX_TASK_LENGTH)
    return `Usá como máximo ${MAX_TASK_LENGTH} caracteres.`;
  return "";
}

export function normalizeTaskText(value) {
  return value.trim().toLocaleLowerCase("es-AR");
}

export function isDuplicateTask(tasks, value, excludedId = null) {
  const normalizedValue = normalizeTaskText(value);
  return tasks.some(
    (task) =>
      task.id !== excludedId &&
      normalizeTaskText(task.texto) === normalizedValue,
  );
}
