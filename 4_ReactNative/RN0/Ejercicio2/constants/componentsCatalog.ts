import Ionicons from '@expo/vector-icons/Ionicons';

import type { GradientKey } from './gradients';

export type IconName = React.ComponentProps<typeof Ionicons>['name'];

export type ComponentEntry = {
  id: string;
  name: string;
  icon: IconName;
  color: GradientKey;
  usage: string;
  /** true cuando la demo necesita su propio alto fijo (listas, pull-to-refresh) en vez de ir dentro del scroll general */
  fullHeight?: boolean;
};

export type Category = {
  id: string;
  title: string;
  short: string;
  icon: IconName;
  items: ComponentEntry[];
};

export const CATALOG: Category[] = [
  {
    id: 'layout',
    title: 'Estructura y layout',
    short: 'Estructura',
    icon: 'cube-outline',
    items: [
      {
        id: 'view',
        name: 'View',
        icon: 'cube-outline',
        color: 'cyan',
        usage: 'Contenedor básico para organizar elementos.',
      },
      {
        id: 'safeareaview',
        name: 'SafeAreaView',
        icon: 'phone-portrait-outline',
        color: 'blue',
        usage: 'Evita que el contenido se superponga con las áreas seguras.',
      },
      {
        id: 'scrollview',
        name: 'ScrollView',
        icon: 'swap-vertical-outline',
        color: 'green',
        usage: 'Contenedor con desplazamiento vertical u horizontal.',
      },
      {
        id: 'keyboardavoidingview',
        name: 'KeyboardAvoidingView',
        icon: 'keypad-outline',
        color: 'purple',
        usage: 'Ajusta el contenido cuando se muestra el teclado.',
      },
    ],
  },
  {
    id: 'media',
    title: 'Texto y contenido',
    short: 'Texto',
    icon: 'document-text-outline',
    items: [
      {
        id: 'text',
        name: 'Text',
        icon: 'text-outline',
        color: 'indigo',
        usage: 'Muestra texto con diferentes estilos.',
      },
      {
        id: 'image',
        name: 'Image',
        icon: 'image-outline',
        color: 'pink',
        usage: 'Muestra imágenes desde archivos locales o remotos.',
      },
      {
        id: 'imagebackground',
        name: 'ImageBackground',
        icon: 'layers-outline',
        color: 'orange',
        usage: 'Contenedor con una imagen de fondo.',
      },
      {
        id: 'statusbar',
        name: 'StatusBar',
        icon: 'time-outline',
        color: 'blue',
        usage: 'Controla el color e ícono de la barra de estado del sistema.',
      },
    ],
  },
  {
    id: 'inputs',
    title: 'Entradas',
    short: 'Entrada',
    icon: 'create-outline',
    items: [
      {
        id: 'textinput',
        name: 'TextInput',
        icon: 'create-outline',
        color: 'cyan',
        usage: 'Campo de texto editable para que el usuario escriba datos.',
      },
      {
        id: 'switch',
        name: 'Switch',
        icon: 'toggle-outline',
        color: 'green',
        usage: 'Interruptor on/off para activar o desactivar una opción.',
      },
    ],
  },
  {
    id: 'touchables',
    title: 'Táctiles y botones',
    short: 'Táctiles',
    icon: 'finger-print-outline',
    items: [
      {
        id: 'button',
        name: 'Button',
        icon: 'apps-outline',
        color: 'indigo',
        usage: 'Botón nativo simple con el estilo del sistema operativo.',
      },
      {
        id: 'pressable',
        name: 'Pressable',
        icon: 'finger-print-outline',
        color: 'purple',
        usage: 'API táctil moderna y flexible para crear botones a medida.',
      },
      {
        id: 'touchableopacity',
        name: 'TouchableOpacity',
        icon: 'hand-left-outline',
        color: 'orange',
        usage: 'Baja su opacidad al presionar, como feedback visual.',
      },
      {
        id: 'touchablehighlight',
        name: 'TouchableHighlight',
        icon: 'hand-right-outline',
        color: 'pink',
        usage: 'Resalta el fondo al presionar el contenido.',
      },
      {
        id: 'touchablewithoutfeedback',
        name: 'TouchableWithoutFeedback',
        icon: 'ban-outline',
        color: 'blue',
        usage: 'Detecta el toque sin ningún efecto visual automático.',
      },
    ],
  },
  {
    id: 'lists-feedback',
    title: 'Listas y feedback',
    short: 'Listas',
    icon: 'list-outline',
    items: [
      {
        id: 'flatlist',
        name: 'FlatList',
        icon: 'list-outline',
        color: 'cyan',
        usage: 'Lista larga y performante: solo renderiza lo visible.',
        fullHeight: true,
      },
      {
        id: 'sectionlist',
        name: 'SectionList',
        icon: 'albums-outline',
        color: 'green',
        usage: 'Como FlatList, pero agrupa los datos en secciones.',
        fullHeight: true,
      },
      {
        id: 'modal',
        name: 'Modal',
        icon: 'copy-outline',
        color: 'purple',
        usage: 'Muestra contenido flotante encima de toda la pantalla.',
      },
      {
        id: 'activityindicator',
        name: 'ActivityIndicator',
        icon: 'sync-outline',
        color: 'orange',
        usage: 'Indicador de carga (spinner) mientras se espera algo.',
      },
      {
        id: 'refreshcontrol',
        name: 'RefreshControl',
        icon: 'refresh-outline',
        color: 'pink',
        usage: 'Agrega el gesto "pull to refresh" para recargar datos.',
        fullHeight: true,
      },
    ],
  },
];

export function findComponentEntry(id: string): ComponentEntry | undefined {
  for (const category of CATALOG) {
    const found = category.items.find((item) => item.id === id);
    if (found) return found;
  }
  return undefined;
}

// devuelve todas las categorías o solo la elegida en las etiquetas
export function filterCatalog(categoryId: string): Category[] {
  if (categoryId === 'all') return CATALOG;
  return CATALOG.filter((category) => category.id === categoryId);
}
