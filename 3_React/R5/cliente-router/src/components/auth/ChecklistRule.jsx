// una línea de la lista de requisitos (✓ si se cumple, × si no)
export function ChecklistRule({ ok, children }) {
  return <li className={ok ? "valid" : "invalid"}>{ok ? "✓" : "×"} {children}</li>;
}
