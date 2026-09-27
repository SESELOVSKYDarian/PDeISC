import { Fonts } from './Fonts';

export const COLOR_OPTIONS = [
  { name: 'Teal', value: '#0D9488' },
  { name: 'Naranja', value: '#F97316' },
  { name: 'Violeta', value: '#7C3AED' },
  { name: 'Rosa', value: '#DB2777' },
];

export const FONT_OPTIONS = [
  { name: 'Regular', family: Fonts.regular },
  { name: 'Semibold', family: Fonts.semibold },
  { name: 'Extrabold', family: Fonts.extrabold },
];

export const DENSITY_OPTIONS = [
  { name: 'Compacto', padding: 16 },
  { name: 'Espacioso', padding: 40 },
];

export const SHAPE_OPTIONS = [
  { name: 'Redondeado', radius: 28, shadow: true },
  { name: 'Recto', radius: 4, shadow: false },
];
