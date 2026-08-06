import { useState } from "react";
import { Minus, Plus, RotateCcw } from "lucide-react";

export default function Contador() {
  const [count, setCount] = useState(0);
  // Cada botón actualiza el mismo estado que se muestra en pantalla.
  return (
    <section className="counter">
      <p className="eyebrow">Ejercicio 3 · useState</p>
      <h1>Contador</h1>
      <output aria-live="polite">{count}</output>
      <div className="actions">
        <button
          type="button"
          aria-label="Decrementar"
          onClick={() => setCount((value) => value - 1)}
        >
          <Minus />
          Decrementar
        </button>
        <button type="button" onClick={() => setCount(0)}>
          <RotateCcw />
          Reiniciar
        </button>
        <button
          type="button"
          aria-label="Incrementar"
          onClick={() => setCount((value) => value + 1)}
        >
          <Plus />
          Incrementar
        </button>
      </div>
    </section>
  );
}
