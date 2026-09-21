import { SearchIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function UserSearch({ value, onChange, onSearch }) {
  function submit(event) {
    event.preventDefault();
    onSearch();
  }

  return (
    <form className="flex gap-2" onSubmit={submit}>
      <Input
        className="h-9 max-w-sm rounded-full bg-card px-4"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Buscar por nombre o email"
        maxLength={100}
        aria-label="Buscar usuarios"
      />
      <Button type="submit" variant="outline" size="lg" className="rounded-full">
        <SearchIcon data-icon="inline-start" />Buscar
      </Button>
    </form>
  );
}
