import { networkInterfaces } from "node:os";

const PRIVADA = /^(192\.168\.|10\.|172\.(1[6-9]|2\d|3[01])\.)/;

// IP de esta PC dentro de la red (la que ve el celular); null si no hay
export function ipLocal() {
  for (const interfaz of Object.values(networkInterfaces())) {
    for (const dir of interfaz ?? []) {
      if (dir.family === "IPv4" && !dir.internal && PRIVADA.test(dir.address)) return dir.address;
    }
  }
  return null;
}

// "192-168-88-25.nip.io" resuelve a 192.168.88.25 y Google lo acepta
export const dominioNip = (ip) => `${ip.replaceAll(".", "-")}.nip.io`;
