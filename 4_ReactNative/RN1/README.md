# DePaso

App de acceso de usuarios: React Native (Expo + TypeScript), API Node/Express y MySQL (XAMPP).
Login, registro y entrada con Google, Meta y Discord. Estructura de carpetas en [directorio.md](directorio.md).

## Requisitos

- Node.js 20 o superior.
- XAMPP (MySQL/MariaDB).
- Expo Go en el celular (versión que soporte el SDK 57).
- Para entrar con redes desde el celular: cuenta gratis de [ngrok](https://dashboard.ngrok.com/signup).

## Primera vez

1. **Instalar dependencias**

   ```bash
   npm install
   npm run instalar
   ```

2. **Crear el `.env` del backend**

   ```bash
   cd backend
   copy .env.example .env
   ```

   Completar en `backend/.env`:

   | Variable | Qué poner |
   | --- | --- |
   | `DB_*` | Dejar los valores por defecto de XAMPP (`root`, sin contraseña). |
   | `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Credenciales del cliente OAuth web de Google. |
   | `DISCORD_CLIENT_ID` / `DISCORD_CLIENT_SECRET` | Credenciales de la app de Discord. |
   | `FACEBOOK_APP_ID` / `FACEBOOK_APP_SECRET` | Credenciales de la app de Meta (Facebook Login). |
   | `OAUTH_MOVIL_BASE` | Tu dominio de ngrok (ver más abajo). Solo para el celular. |

   Las redes que dejes vacías no aparecen en la app. El `.env` está en `.gitignore`: no se sube.

3. **Configurar ngrok (solo si vas a usar redes sociales en el celular)**

   1. Crear la cuenta e instalar ngrok.
   2. Copiar tu token desde <https://dashboard.ngrok.com/get-started/your-authtoken> y guardarlo (una vez por PC):

      ```bash
      ngrok config add-authtoken TU_TOKEN
      ```

   3. Ver tu dominio estático gratis en <https://dashboard.ngrok.com/domains> (algo como `xxxx.ngrok-free.dev`).
   4. Ponerlo en `backend/.env`:

      ```
      OAUTH_MOVIL_BASE=https://xxxx.ngrok-free.dev
      ```

   5. Registrar la URL de retorno en la consola de cada red (una sola vez):

      | Red | Dónde | URL |
      | --- | --- | --- |
      | Google | Cloud Console → APIs y servicios → Credenciales → tu cliente web → **URIs de redireccionamiento autorizados** | `https://xxxx.ngrok-free.dev/auth/google/callback` |
      | Discord | Developer Portal → OAuth2 → Redirects | `https://xxxx.ngrok-free.dev/auth/discord/callback` |
      | Meta | Facebook Login → Configuración → URI de redireccionamiento de OAuth válidos | `https://xxxx.ngrok-free.dev/auth/facebook/callback` |

      Ojo con Google: la URL con ruta va en *URIs de redireccionamiento*, no en *Orígenes de JavaScript* (ahí solo el dominio, sin `/`).
      Para web y emulador siguen valiendo las URL con `http://localhost:5175/auth/<red>/callback`.

## Cada vez que lo uses

1. Panel de XAMPP → **Start** en MySQL.
2. En la carpeta del proyecto (`RN1/`), un solo comando:

   ```bash
   npm run dev
   ```

   Levanta la API y Expo juntos. Con redes sociales en el celular, que también abre ngrok:

   ```bash
   npm run dev:todo
   ```

   (`dev:todo` usa tu dominio estático de la cuenta. Si querés fijarlo a mano: `ngrok http 5175 --url=xxxx.ngrok-free.dev` en otra terminal y usar `npm run dev`.)

También se pueden correr por separado: `npm run dev:api`, `npm run dev:app`, `npm run dev:ngrok`.

- La API crea sola la base `depaso`, las tablas y los usuarios de prueba (`backend/database/seed.js`).
- Unos 12 segundos después de arrancar aparece el **QR** en la salida `[qr]`: escanearlo con Expo Go (PC y celular en el mismo Wi-Fi). Si no lo ves, escribí en Expo Go la URL `exp://<ip-de-tu-PC>:8082`.
- Si otro proyecto tuyo ya usa el 8081 (por ejemplo otra app de Expo), no pasa nada: DePaso usa el **8082**.
- Al arrancar, la API imprime las URLs de retorno que tenés que tener registradas.
- Para probar en la PC: abrir <http://localhost:8082> en el navegador (la terminal de `concurrently` no acepta teclas).

| Servicio | Puerto |
| --- | --- |
| API | 3001 |
| Retorno de las redes | 5175 |
| Expo / Metro | 8082 |
| MySQL | 3306 |

## Probar el ingreso con Google desde el celular

1. Las cuatro terminales corriendo.
2. Abrir la app en Expo Go y tocar **Continuar con Google**.
3. Elegir la cuenta y aceptar.
4. La primera vez ngrok muestra una página de aviso: tocar **Visit Site**.
5. Expo Go se reabre y la app muestra la bienvenida. Si el email no existía, se crea la cuenta.

## Otra computadora

1. Instalar Node, XAMPP y ngrok, y clonar el repo.
2. Repetir **Primera vez** pasos 1 y 2, y `ngrok config add-authtoken` con la misma cuenta.
3. Poner el mismo `OAUTH_MOVIL_BASE`. La URL registrada en las redes sigue valiendo: no hay que tocarlas de nuevo.

## Problemas comunes

| Síntoma | Causa y solución |
| --- | --- |
| "No pude conectar con el servidor" en el celular | Celular y PC en distinto Wi-Fi, o el Firewall de Windows bloquea Node en las redes privadas (puertos 3001 y 8082). |
| La API dice "¿Está encendido XAMPP?" | Arrancar MySQL desde el panel de XAMPP. |
| Google no vuelve a la app | ngrok apagado, el dominio de `OAUTH_MOVIL_BASE` distinto al de ngrok, o la URL no está en *URIs de redireccionamiento*. Esperar unos minutos tras guardar en Google. |
| `redirect_uri_mismatch` | La URL registrada no es idéntica a `OAUTH_MOVIL_BASE` + `/auth/<red>/callback`. Copiarla de lo que imprime la API al arrancar. |
| Error de Expo Go por versión | Actualizar Expo Go: el proyecto usa el SDK 57. |

## Seguridad

- No subir `.env`, el token de ngrok ni las credenciales de las redes.
- Con el túnel abierto, el puerto 5175 es accesible desde internet. Solo acepta devoluciones con un `state` válido y de un solo uso. Cerrar ngrok cuando no se use.
- Los usuarios de prueba son solo para desarrollo.
