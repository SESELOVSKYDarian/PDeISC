// Paleta "Apple": colores de sistema iOS (systemBlue, systemGray, grouped background).
// Valores tomados de la Human Interface Guidelines (Color).
const tintLight = '#0088FF'; // System Blue (light)
const tintDark = '#0091FF'; // System Blue (dark)

export default {
  light: {
    text: '#000000', // label
    textMuted: '#8E8E93', // systemGray / secondaryLabel aprox.
    background: '#F2F2F7', // systemGroupedBackground
    surface: '#FFFFFF', // secondarySystemGroupedBackground (tarjetas)
    border: '#C6C6C8', // separator
    tint: tintLight,
    accent: tintLight,
    tabIconDefault: '#8E8E93',
  },
  dark: {
    text: '#FFFFFF',
    textMuted: '#8E8E93',
    background: '#000000', // systemGroupedBackground (dark)
    surface: '#1C1C1E', // secondarySystemGroupedBackground (dark)
    border: '#38383A',
    tint: tintDark,
    accent: tintDark,
    tabIconDefault: '#8E8E93',
  },
};

// Un color de acento por categoría, como los íconos de cuadrado redondeado de Ajustes.
export const CategoryAccents: Record<string, string> = {
  layout: '#00C3D0', // teal
  media: '#6155F5', // indigo
  inputs: tintLight, // blue
  touchables: '#FF8D28', // orange
  'lists-feedback': '#FF2D55', // pink
};
