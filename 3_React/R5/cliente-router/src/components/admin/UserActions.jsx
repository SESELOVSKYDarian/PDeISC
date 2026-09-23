import { PencilIcon, Trash2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";

// botones de editar y eliminar (los usan la fila de la tabla y la tarjeta del celular)
export function UserActions({ user, onEdit, onDelete }) {
  return (
    <div className="flex justify-end gap-1">
      <Button variant="ghost" size="icon" onClick={() => onEdit(user)} aria-label={`Editar a ${user.nombre}`} title="Editar">
        <PencilIcon />
      </Button>
      <Button variant="ghost" size="icon" className="text-destructive" onClick={() => onDelete(user)} aria-label={`Eliminar a ${user.nombre}`} title="Eliminar">
        <Trash2Icon />
      </Button>
    </div>
  );
}
