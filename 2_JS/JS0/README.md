# JS0

Proyecto de práctica de métodos de arrays con Node.js y JavaScript.

## Qué incluye

- `server.js`: launcher principal en `http://localhost:3000`
- `modules/`: ejercicios individuales servidos en puertos `3001` a `3015`
- `pages/`, `scripts/`, `styles/`: interfaz del launcher
- `Ej01_*` a `Ej14_*`: ejercicios front-end independientes
- `tools/fix-mojibake.js`: utilidad para normalizar archivos UTF-8 con texto roto

## Cómo correrlo

```bash
npm start
```

Scripts útiles:

- `npm run start:push`
- `npm run start:pop`
- `npm run start:unshift`
- `npm run start:shift`
- `npm run start:splice`
- `npm run start:slice`
- `npm run start:indexOf`
- `npm run start:includes`
- `npm run start:forEach`
- `npm run start:map`
- `npm run start:filter`
- `npm run start:reduce`
- `npm run start:sort`
- `npm run start:reverse`
- `npm run start:secreto`
- `npm run start:all`

## Estructura

- `modules/shared/exercisesCatalog.js`: catálogo y ejecución de variantes
- `modules/shared/ejerciciosData.js`: dataset auxiliar
- `modules/ejercicioXX_*`: servidor y front de cada ejercicio

## Codificación

Si vuelven a aparecer textos como `MÃ©todo`, `operaciÃ³n` o `vÃ¡lido`, ejecutar:

```bash
node tools/fix-mojibake.js
```

Eso intenta reparar mojibake UTF-8 frecuente y también elimina la leyenda visual que decía ``.
