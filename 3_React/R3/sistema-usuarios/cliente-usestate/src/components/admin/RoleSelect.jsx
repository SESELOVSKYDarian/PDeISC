import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function RoleSelect({ id, value, onChange }) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger id={id} className="w-full"><SelectValue /></SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="usuario">Usuario</SelectItem>
          <SelectItem value="administrador">Administrador</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
