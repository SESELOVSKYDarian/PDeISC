import { networkInterfaces } from "node:os";
import qrcode from "qrcode-terminal";

const PUERTO = 8082; // el de `npm run dev:app`
const PRIVADA = /^(192\.168\.|10\.|172\.(1[6-9]|2\d|3[01])\.)/;

// IP de esta PC en la red local
function ipLocal() {
  for (const interfaz of Object.values(networkInterfaces())) {
    for (const dir of interfaz ?? []) {
      if (dir.family === "IPv4" && !dir.internal && PRIVADA.test(dir.address)) return dir.address;
    }
  }
  return null;
}

const ip = ipLocal();
if (!ip) {
  console.log("No encontré la IP de la PC en la red. Escribí a mano exp://<tu-ip>:8082 en Expo Go.");
  process.exit(0);
}

// espero a que Metro termine de arrancar antes de mostrar el QR
setTimeout(() => {
  const url = `exp://${ip}:${PUERTO}`;
  console.log(`\nAbrí Expo Go y escaneá este QR (o escribí ${url}):\n`);
  qrcode.generate(url, { small: true });
}, 12000);
