# Directorio – SensorLab (RN2)

App Expo (SDK 58) que usa las herramientas del celular: cámara, lector de códigos, GPS, acelerómetro, giroscopio, brújula, biometría y más.
Sin backend ni base de datos: todo se lee de sensores reales del teléfono.

## Cómo correrla

```bash
cd app
npm install
npm run lan        # Expo Go por LAN, puerto 8083 (escaneá el QR)
npm run mcp        # igual, pero con el servidor MCP de Expo activado
npm run typecheck  # tsc --noEmit
```

## Estructura

```text
RN2/
├── directorio.md          ← este archivo
└── app/                   ← proyecto Expo
    ├── app.json           ← nombre, permisos y plugins
    ├── eas.json           ← perfiles de EAS (preview = APK). Todavía no se ejecuta ningún build
    ├── package.json
    ├── tsconfig.json      ← alias "@/" apunta a src/
    ├── assets/            ← ícono, splash y favicon (logo S Órbita)
    └── src/
        ├── app/           ← RUTAS (expo-router). Cada archivo solo re-exporta una pantalla
        │   ├── _layout.tsx        ← tema, navegación, títulos e intro con el logo
        │   ├── index.tsx          ← inicio: lista de herramientas
        │   └── camara.tsx, escaner.tsx, ubicacion.tsx ... (una por herramienta)
        ├── modules/       ← UNA CARPETA POR HERRAMIENTA (pantalla + hook + piezas chicas)
        │   ├── camara/         CamaraScreen, useCamara, Obturador, UltimaCaptura
        │   ├── escaner/        EscanerScreen, useEscaner, ResultadoCodigo
        │   ├── galeria/        GaleriaScreen, useGaleria
        │   ├── ubicacion/      UbicacionScreen, useUbicacion
        │   ├── acelerometro/   AcelerometroScreen, useAcelerometro, BarraEje
        │   ├── giroscopio/     GiroscopioScreen, useGiroscopio, Pelota
        │   ├── brujula/        BrujulaScreen, useBrujula, Rosa
        │   ├── biometria/      BiometriaScreen, useBiometria
        │   ├── bateria/        BateriaScreen, BarraNivel
        │   ├── vibracion/      VibracionScreen, FilaAccion
        │   ├── dispositivo/    DispositivoScreen
        │   └── portapapeles/   PortapapelesScreen, usePortapapeles
        ├── components/
        │   ├── common/    ← piezas reutilizables: Logo, Pantalla, Grupo, Fila, Boton, BotonCircular,
        │   │                Aviso, Valor, Segmentado, PermisoGate, PressableScale, IconoHerramienta, BotonSubir
        │   └── home/      ← FilaHerramienta, BotonTema, Presentacion (intro animada con el logo)
        ├── hooks/         ← useSensor (acelerómetro/giroscopio/magnetómetro/barómetro), useMensaje
        ├── data/          ← herramientas.ts: lista única que usan el inicio y el router
        ├── theme/         ← colors (claro/oscuro), medidas (espaciado, radios, tipografía), ThemeProvider
        └── utils/         ← formato.ts (números), angulos.ts (rumbo de la brújula)
```

## Dónde está cada cosa

| Quiero tocar…                    | Voy a…                                    |
| -------------------------------- | ----------------------------------------- |
| Agregar una herramienta          | `data/herramientas.ts` + `modules/<x>/` + `app/<x>.tsx` |
| Colores / modo oscuro            | `theme/colors.ts`, `theme/ThemeProvider.tsx` |
| Espaciado y tipografía           | `theme/medidas.ts`                        |
| Cómo se lee un sensor            | `hooks/useSensor.ts`                      |
| Permisos del sistema             | `app.json` (plugins) + `PermisoGate`      |

## Diseño

Estilo Apple: colores del sistema iOS, grupos redondeados, mucho espacio, un número protagonista por pantalla y animaciones cortas (feedback al apretar 90 ms, entradas 320 ms). Tema claro/oscuro con botón en el inicio, guardado en AsyncStorage.

## Fuera del repo (.gitignore)

`node_modules`, `.expo`, `dist`, `.env*`, carpetas de IA (`.claude/`, `AGENTS.md`, `CLAUDE.md`).
