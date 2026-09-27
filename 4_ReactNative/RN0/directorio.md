# RN0 — React Native con Expo

Dos proyectos independientes, cada uno con su propio `package.json`, corridos por separado
(`npx expo start` dentro de cada carpeta).

```text
RN0/
├── Ejercicio1/   Primer proyecto Expo + TS: pantalla "Hola Mundo" + tab con otro estilo
└── Ejercicio2/   Catálogo de componentes nativos de React Native, con demo en vivo
```

## Ejercicio1 — Hola Mundo + tabs

Expo Router (SDK 52) con 2 tabs.

```text
Ejercicio1/
├── app/
│   ├── (tabs)/
│   │   ├── _layout.tsx   navegador de tabs (íconos, colores activos)
│   │   ├── index.tsx     tab "Inicio": hola mundo limpio y centrado
│   │   └── two.tsx       tab "Estilos": mismo dato, otra paleta/layout (grilla de tarjetas)
│   ├── _layout.tsx       stack raíz + tema claro/oscuro
│   └── +not-found.tsx
├── components/
│   ├── Themed.tsx        Text/View que cambian de color según el tema
│   └── useColorScheme.ts
└── constants/Colors.ts   paleta semántica (texto, fondo, superficie, borde, tint, accent)
```

Correr:

```bash
cd Ejercicio1
npm run start
```

## Ejercicio2 — Componentes nativos de React Native

Expo Router (SDK 52). Pantalla principal con las categorías, cada componente abre su propia
demo funcionando con una explicación de para qué se usa.

```text
Ejercicio2/
├── app/
│   ├── index.tsx                 home: categorías + lista + botón "subir arriba"
│   ├── componentes/[name].tsx    ruta dinámica: busca el componente en el catálogo y
│   │                             renderiza su demo (ver components/demos/registry.ts)
│   └── _layout.tsx                stack + tema claro/oscuro
├── components/
│   ├── DemoScreen.tsx            layout común de cada pantalla de demo
│   ├── Themed.tsx / useColorScheme.ts
│   ├── home/
│   │   ├── CategorySection.tsx   una categoría con su tarjeta de items
│   │   ├── ComponentListItem.tsx fila individual (ícono + nombre + flecha)
│   │   └── ScrollTopButton.tsx   botón flotante para volver arriba
│   └── demos/
│       ├── registry.ts           mapa id → componente de demo
│       └── *.tsx                 una demo chica por componente nativo (19 en total)
└── constants/
    ├── Colors.ts
    └── componentsCatalog.ts      datos: id, nombre, ícono, categoría, para qué se usa
```

Componentes cubiertos (19), agrupados por categoría en `componentsCatalog.ts`:

- **Estructura y layout**: View, SafeAreaView, ScrollView, KeyboardAvoidingView
- **Texto y contenido**: Text, Image, StatusBar
- **Entradas**: TextInput, Switch
- **Táctiles y botones**: Button, Pressable, TouchableOpacity, TouchableHighlight, TouchableWithoutFeedback
- **Listas y feedback**: FlatList, SectionList, Modal, ActivityIndicator, RefreshControl

Para agregar un componente nuevo: sumar su entrada en `constants/componentsCatalog.ts`,
crear `components/demos/NombreDemo.tsx` y registrarlo en `components/demos/registry.ts`.

Correr:

```bash
cd Ejercicio2
npm run start
```

## Notas

- Ambos proyectos usan TypeScript estricto, Expo Router y siguen el mismo patrón de
  `Themed.tsx` + `constants/Colors.ts` para claro/oscuro automático (según el sistema).
- `npx tsc --noEmit`, `npx expo lint` y `npx expo-doctor` pasan limpios en los dos.
