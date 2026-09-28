# RN0 — React Native con Expo

Dos proyectos independientes, cada uno con su propio `package.json`, corridos por separado
(`npx expo start` dentro de cada carpeta).

```text
RN0/
├── Ejercicio1/   Primer proyecto Expo + TS: pantalla "Hola Mundo" + tab con otro estilo
└── Ejercicio2/   Catálogo de componentes nativos de React Native, con demo en vivo
```

## Ejercicio1 — Hola Mundo + tabs

Expo Router (SDK 57), 2 tabs y botón claro/oscuro en el header (se guarda con AsyncStorage).

```text
Ejercicio1/
├── app/
│   ├── (tabs)/
│   │   ├── _layout.tsx   tabs + provider de estilos + botón de tema
│   │   ├── index.tsx     "Inicio": hola mundo, usa el estilo elegido
│   │   └── two.tsx       "Estilos": 4 controles (color, tipografía, layout, forma) que cambian toda la app
│   ├── _layout.tsx       stack raíz, fuentes, carga del tema guardado
│   └── +not-found.tsx
├── components/           Themed, ThemeToggleButton, useColorScheme
├── context/StyleSettings.tsx   estado compartido de los estilos
├── constants/            Colors, Fonts, styleOptions
└── lib/themePreference.ts      guardar/leer tema claro-oscuro
```

## Ejercicio2 — Componentes nativos de React Native

Expo Router (SDK 57). Home con hero, búsqueda, chips de categoría y cards con miniatura;
cada componente abre su demo funcionando. Botón claro/oscuro en el hero y en el detalle.

```text
Ejercicio2/
├── app/
│   ├── index.tsx                 home: hero + búsqueda + chips + secciones
│   ├── componentes/[name].tsx    detalle: busca en el catálogo y renderiza la demo
│   └── _layout.tsx               stack, fuentes, tema guardado
├── components/
│   ├── DemoScreen.tsx            layout común del detalle
│   ├── ThemeToggleButton.tsx / Themed.tsx / useColorScheme.ts
│   ├── home/
│   │   ├── Hero.tsx  SearchBar.tsx  CategoryChips.tsx
│   │   ├── CategorySection.tsx  ComponentCard.tsx
│   │   ├── ComponentThumbnail.tsx   miniaturas dibujadas con Views
│   │   └── ScrollTopButton.tsx
│   └── demos/                    una demo por componente (20) + registry.ts
├── constants/                    Colors, Fonts, Typography, gradients, componentsCatalog (datos + filtro)
└── lib/themePreference.ts
```

Componentes cubiertos (20): View, SafeAreaView, ScrollView, KeyboardAvoidingView, Text, Image,
ImageBackground, StatusBar, TextInput, Switch, Button, Pressable, TouchableOpacity,
TouchableHighlight, TouchableWithoutFeedback, FlatList, SectionList, Modal, ActivityIndicator,
RefreshControl.

Agregar uno nuevo: entrada en `constants/componentsCatalog.ts`, demo en `components/demos/`,
registro en `registry.ts` y (opcional) dibujo en `ComponentThumbnail.tsx`.

## Correr

```bash
cd Ejercicio1   # o Ejercicio2
npx expo start
```

`tsc --noEmit`, `expo lint` y `expo-doctor` pasan limpios en los dos.
