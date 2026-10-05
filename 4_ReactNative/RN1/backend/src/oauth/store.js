import { randomBytes } from "node:crypto";

const MAXIMO = 1000; // tope de valores pendientes: evita llenar la memoria

// guarda valores de un solo uso en memoria, con vencimiento
function crearStore(minutos) {
  const items = new Map();

  // borro los vencidos y, si sigue lleno, los más viejos
  function limpiar() {
    const ahora = Date.now();
    for (const [clave, item] of items) {
      if (item.vence <= ahora) items.delete(clave);
    }
    while (items.size >= MAXIMO) items.delete(items.keys().next().value);
  }

  return {
    guardar(valor) {
      limpiar();
      const clave = randomBytes(24).toString("hex");
      items.set(clave, { valor, vence: Date.now() + minutos * 60_000 });
      return clave;
    },
    // devuelve el valor y lo borra; null si no existe o venció
    sacar(clave) {
      const item = items.get(clave);
      items.delete(clave);
      return item && item.vence > Date.now() ? item.valor : null;
    },
  };
}

export const estados = crearStore(10);  // anti-CSRF del pedido a la red
export const tickets = crearStore(2);   // canje del usuario por la app
