import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { UserRow } from "./UserRow";

export function UserTable({ users, onEdit, onDelete }) {
  return (
    <div className="overflow-hidden rounded-2xl border bg-card shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="px-4">Usuario</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Rol</TableHead>
            <TableHead>Alta</TableHead>
            <TableHead className="px-4 text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <UserRow key={user.id} user={user} onEdit={onEdit} onDelete={onDelete} />
          ))}
          {users.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">No hay usuarios para mostrar.</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
