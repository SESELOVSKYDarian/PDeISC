// etiqueta + campo + mensaje de error, para el login y el registro
export function AuthField({ label, error, children }) {
  return (
    <label className="field">
      {label}
      {children}
      {error && <span className="error" role="alert">{error}</span>}
    </label>
  );
}
