// Paleta "Showcase": navy oscuro + cian, con su versión clara.
export default {
  light: {
    text: '#0B1220',
    textMuted: '#5C6778',
    background: '#F3F6FA',
    surface: '#FFFFFF',
    surfaceAlt: '#EAF0F7',
    border: '#DDE5EF',
    tint: '#0783A0',
    accent: '#0783A0',
    glow: '#19D3E0',
    tabIconDefault: '#5C6778',
  },
  dark: {
    text: '#F5F7FA',
    textMuted: '#8A94A6',
    background: '#070B12',
    surface: '#0E1420',
    surfaceAlt: '#141C2B',
    border: '#1D2738',
    tint: '#0A93B0',
    accent: '#0A93B0',
    glow: '#19D3E0',
    tabIconDefault: '#8A94A6',
  },
};

// Degradé del hero según el tema.
export const HeroGradients = {
  light: ['#D6F3F7', '#F3F6FA'],
  dark: ['#0B2A33', '#070B12'],
} as const;
