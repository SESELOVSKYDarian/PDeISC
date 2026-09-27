import Ionicons from '@expo/vector-icons/Ionicons';

export type IconName = React.ComponentProps<typeof Ionicons>['name'];

export type ComponentEntry = {
  id: string;
  name: string;
  icon: IconName;
  usage: string;
  /** true cuando la demo necesita su propio alto fijo (listas, pull-to-refresh) en vez de ir dentro del scroll general */
  fullHeight?: boolean;
};

export type Category = {
  id: string;
  title: string;
  icon: IconName;
  items: ComponentEntry[];
};

export const CATALOG: Category[] = [
  {
    id: 'layout',
    title: 'Estructura y layout',
    icon: 'layers-outline',
    items: [
      {
        id: 'view',
        name: 'View',
        icon: 'cube-outline',
        usage: 'Contenedor básico para agrupar y ordenar otros componentes, como un div en web.',
      },
      {
        id: 'safeareaview',
        name: 'SafeAreaView',
        icon: 'phone-portrait-outline',
        usage: 'Evita que el contenido quede debajo del notch, la cámara o la barra de estado.',
      },
      {
        id: 'scrollview',
        name: 'ScrollView',
        icon: 'swap-vertical-outline',
        usage: 'Contenedor con scroll para contenido que no entra en la pantalla.',
      },
      {
        id: 'keyboardavoidingview',
        name: 'KeyboardAvoidingView',
        icon: 'keypad-outline',
        usage: 'Corre el contenido hacia arriba cuando aparece el teclado, para no tapar inputs.',
      },
    ],
  },
  {
    id: 'media',
    title: 'Texto y contenido',
    icon: 'image-outline',
    items: [
      {
        id: 'text',
        name: 'Text',
        icon: 'text-outline',
        usage: 'Muestra texto en pantalla. Todo texto en React Native debe ir dentro de un Text.',
      },
      {
        id: 'image',
        name: 'Image',
        icon: 'image-outline',
        usage: 'Muestra imágenes locales o remotas (URL).',
      },
      {
        id: 'statusbar',
        name: 'StatusBar',
        icon: 'time-outline',
        usage: 'Controla el color e ícono de la barra de estado del sistema (hora, batería).',
      },
    ],
  },
  {
    id: 'inputs',
    title: 'Entradas',
    icon: 'create-outline',
    items: [
      {
        id: 'textinput',
        name: 'TextInput',
        icon: 'create-outline',
        usage: 'Campo de texto editable para que el usuario escriba datos.',
      },
      {
        id: 'switch',
        name: 'Switch',
        icon: 'toggle-outline',
        usage: 'Interruptor on/off para activar o desactivar una opción booleana.',
      },
    ],
  },
  {
    id: 'touchables',
    title: 'Táctiles y botones',
    icon: 'finger-print-outline',
    items: [
      {
        id: 'button',
        name: 'Button',
        icon: 'apps-outline',
        usage: 'Botón nativo simple con estilo del sistema operativo, poco personalizable.',
      },
      {
        id: 'pressable',
        name: 'Pressable',
        icon: 'finger-print-outline',
        usage: 'API táctil moderna y flexible; recomendada para crear botones a medida.',
      },
      {
        id: 'touchableopacity',
        name: 'TouchableOpacity',
        icon: 'hand-left-outline',
        usage: 'Envuelve contenido táctil que baja su opacidad al presionar, como feedback visual.',
      },
      {
        id: 'touchablehighlight',
        name: 'TouchableHighlight',
        icon: 'hand-right-outline',
        usage: 'Similar a TouchableOpacity pero resalta el fondo al presionar.',
      },
      {
        id: 'touchablewithoutfeedback',
        name: 'TouchableWithoutFeedback',
        icon: 'ban-outline',
        usage: 'Detecta el toque sin aplicar ningún efecto visual automático.',
      },
    ],
  },
  {
    id: 'lists-feedback',
    title: 'Listas y feedback',
    icon: 'list-outline',
    items: [
      {
        id: 'flatlist',
        name: 'FlatList',
        icon: 'list-outline',
        usage: 'Lista larga y performante: solo renderiza lo visible en pantalla.',
        fullHeight: true,
      },
      {
        id: 'sectionlist',
        name: 'SectionList',
        icon: 'layers-outline',
        usage: 'Como FlatList, pero agrupa los datos en secciones con encabezado.',
        fullHeight: true,
      },
      {
        id: 'modal',
        name: 'Modal',
        icon: 'copy-outline',
        usage: 'Muestra contenido flotante encima de toda la pantalla actual.',
      },
      {
        id: 'activityindicator',
        name: 'ActivityIndicator',
        icon: 'sync-outline',
        usage: 'Indicador de carga (spinner) mientras se espera una operación.',
      },
      {
        id: 'refreshcontrol',
        name: 'RefreshControl',
        icon: 'refresh-outline',
        usage: 'Agrega el gesto "pull to refresh" para recargar datos en listas.',
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
