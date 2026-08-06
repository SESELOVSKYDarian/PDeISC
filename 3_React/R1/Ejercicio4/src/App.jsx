import { useEffect, useState } from "react";
import FormularioTarea from "./components/FormularioTarea";
import ListaTareas from "./components/ListaTareas";
import ModalTarea from "./components/ModalTarea";
import ScrollToTop from "./components/ScrollToTop";
import Toast from "./components/Toast";
import ThemeToggle from "./components/ThemeToggle";
import {
  initialTasks,
  isDuplicateTask,
  MAX_TASK_LENGTH,
  MIN_TASK_LENGTH,
} from "./utils/tareas";
import "./global.css";

export default function App() {
  const [dark, setDark] = useState(false);
  const [tasks, setTasks] = useState(initialTasks);
  const [modal, setModal] = useState(null);
  const [editingText, setEditingText] = useState("");
  const [editingError, setEditingError] = useState("");
  const [toast, setToast] = useState("");

  useEffect(() => {
    document.documentElement.dataset.theme = dark ? "dark" : "light";
  }, [dark]);

  const addTask = (text) => {
    if (isDuplicateTask(tasks, text)) {
      return "Ya existe una tarea con ese nombre.";
    }

    setTasks((current) => [
      {
        id: crypto.randomUUID(),
        texto: text,
        completada: false,
        fechaCreacion: new Date(),
      },
      ...current,
    ]);
    return "";
  };
  const toggleTask = (id) =>
    setTasks((current) =>
      current.map((task) =>
        task.id === id ? { ...task, completada: !task.completada } : task,
      ),
    );
  const startEditing = (task) => {
    setEditingText(task.texto);
    setEditingError("");
    setModal({ type: "edit", task });
  };
  const requestDelete = (task) => setModal({ type: "delete", task });
  const closeModal = () => {
    setModal(null);
    setEditingText("");
    setEditingError("");
  };
  const saveEditing = (event) => {
    event.preventDefault();
    const text = editingText.trim();
    if (text.length < MIN_TASK_LENGTH || text.length > MAX_TASK_LENGTH) return;
    if (isDuplicateTask(tasks, text, modal.task.id)) {
      setEditingError("Ya existe otra tarea con ese nombre.");
      return;
    }
    setTasks((current) =>
      current.map((task) =>
        task.id === modal.task.id ? { ...task, texto: text } : task,
      ),
    );
    closeModal();
    setToast("Los cambios se guardaron correctamente.");
  };
  const confirmDelete = () => {
    setTasks((current) => current.filter((task) => task.id !== modal.task.id));
    closeModal();
    setToast("La tarea se eliminó correctamente.");
  };

  // El modal concentra las acciones que necesitan confirmación o edición.
  return (
    <main>
      <ThemeToggle dark={dark} onToggle={() => setDark((value) => !value)} />
      <section className="app">
        <p className="eyebrow">Ejercicio 4 · Estado y formularios</p>
        <h1>Mis tareas</h1>
        <FormularioTarea onAdd={addTask} />
        <ListaTareas
          tasks={tasks}
          onToggle={toggleTask}
          onEdit={startEditing}
          onDelete={requestDelete}
        />
      </section>
      {modal?.type === "edit" && (
        <ModalTarea title="Editar tarea" onClose={closeModal}>
          <form className="modal-form" onSubmit={saveEditing}>
            <label htmlFor="edit-task">Texto de la tarea</label>
            <input
              id="edit-task"
              value={editingText}
              onChange={(event) => {
                setEditingText(event.target.value);
                setEditingError("");
              }}
              minLength={MIN_TASK_LENGTH}
              maxLength={MAX_TASK_LENGTH}
              required
              autoFocus
            />
            <small className="error">{editingError || " "}</small>
            <div className="modal-actions">
              <button type="submit">Guardar cambios</button>
              <button type="button" className="secondary" onClick={closeModal}>
                Cancelar
              </button>
            </div>
          </form>
        </ModalTarea>
      )}
      {modal?.type === "delete" && (
        <ModalTarea title="Eliminar tarea" onClose={closeModal}>
          <div className="modal-confirm">
            <p>¿Seguro que querés eliminar “{modal.task.texto}”?</p>
            <div className="modal-actions">
              <button
                className="danger-action"
                type="button"
                onClick={confirmDelete}
              >
                Sí, eliminar
              </button>
              <button type="button" className="secondary" onClick={closeModal}>
                Cancelar
              </button>
            </div>
          </div>
        </ModalTarea>
      )}
      <Toast message={toast} onClose={() => setToast("")} />
      <ScrollToTop />
    </main>
  );
}
