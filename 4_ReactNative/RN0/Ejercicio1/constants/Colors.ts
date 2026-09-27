// Paleta semántica "Flat moderno": teal + naranja, tokens por rol (no hex sueltos en componentes).
const tealLight = '#0D9488';
const tealDark = '#2DD4BF'; // más claro/desaturado para que rinda en fondo oscuro

const orangeLight = '#F97316';
const orangeDark = '#FB923C';

export default {
  light: {
    text: '#0F172A',
    textMuted: '#64748B',
    background: '#F4FBFA',
    surface: '#FFFFFF',
    border: '#D9F0EC',
    tint: tealLight,
    accent: orangeLight,
    tabIconDefault: '#94A3B8',
    tabIconSelected: tealLight,
  },
  dark: {
    text: '#F1F5F9',
    textMuted: '#94A3B8',
    background: '#08151A',
    surface: '#0F2027',
    border: '#173039',
    tint: tealDark,
    accent: orangeDark,
    tabIconDefault: '#5B7480',
    tabIconSelected: tealDark,
  },
};
