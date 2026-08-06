import ItemTarea from "./ItemTarea";

export default function ListaTareas({ tasks, onToggle, onEdit, onDelete }) {
  if (!tasks.length) return <p className="empty">No hay tareas cargadas.</p>;
  const orderedTasks = [
    ...tasks.filter((task) => !task.completada),
    ...tasks.filter((task) => task.completada),
  ];
  return (
    <ul className="tasks">
      {orderedTasks.map((task) => (
        <ItemTarea
          key={task.id}
          task={task}
          onToggle={onToggle}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
}
