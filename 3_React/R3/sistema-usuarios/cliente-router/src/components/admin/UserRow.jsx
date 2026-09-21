import { PencilIcon, Trash2Icon } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { formatDate } from "@/utils/formatDate";
import { initials } from "@/utils/initials";

export function UserRow({ user, onEdit, onDelete }) {
  const isAdmin = user.rol === "administrador";

  return (
    <TableRow>
      <TableCell className="px-4">
        <div className="flex items-center gap-3 font-medium">
          <Avatar><AvatarFallback>{initials(user.nombre)}</AvatarFallback></Avatar>
          {user.nombre}
        </div>
      </TableCell>
      <TableCell className="text-muted-foreground">{user.email}</TableCell>
      <TableCell><Badge variant={isAdmin ? "default" : "secondary"}>{user.rol}</Badge></TableCell>
      <TableCell className="text-muted-foreground">{formatDate(user.creado_en)}</TableCell>
      <TableCell className="px-4">
        {/* al administrador no se le muestran acciones */}
        {!isAdmin && (
          <div className="flex justify-end gap-1">
            <Button variant="ghost" size="icon" onClick={() => onEdit(user)} aria-label={`Editar a ${user.nombre}`} title="Editar">
              <PencilIcon />
            </Button>
            <Button variant="ghost" size="icon" className="text-destructive" onClick={() => onDelete(user)} aria-label={`Eliminar a ${user.nombre}`} title="Eliminar">
              <Trash2Icon />
            </Button>
          </div>
        )}
      </TableCell>
    </TableRow>
  );
}
