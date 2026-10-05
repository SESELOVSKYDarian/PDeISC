import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import selfsigned from "selfsigned";

const carpeta = fileURLToPath(new URL("../../certs/", import.meta.url));

// certificado propio para el dominio; se crea una vez y se reusa
export async function credencialesHttps(dominio) {
  const archivo = `${carpeta}${dominio}.json`;
  if (existsSync(archivo)) return JSON.parse(readFileSync(archivo, "utf8"));

  const pems = await selfsigned.generate([{ name: "commonName", value: dominio }], {
    days: 365,
    keySize: 2048,
    extensions: [{ name: "subjectAltName", altNames: [{ type: 2, value: dominio }] }],
  });
  const datos = { key: pems.private, cert: pems.cert };
  mkdirSync(carpeta, { recursive: true });
  writeFileSync(archivo, JSON.stringify(datos));
  return datos;
}
