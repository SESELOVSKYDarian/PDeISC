import { fileURLToPath } from "node:url";
import basicSsl from "@vitejs/plugin-basic-ssl";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

// "@" apunta al src de este mismo proyecto.
// Con `--mode https` (npm run dev:https) el servidor usa un certificado local: Facebook solo acepta redirecciones https.
// Las llamadas a /api las reenvía Vite a la API, así el navegador ve un solo origen y las cookies viajan sin problemas.
export default defineConfig(({ mode }) => ({
  plugins: [react(), tailwindcss(), ...(mode === "https" ? [basicSsl()] : [])],
  resolve: { alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) } },
  server: { proxy: { "/api": "http://localhost:4005" } },
}));
