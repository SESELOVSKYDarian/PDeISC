// Degradés de los íconos: [color claro, color oscuro]
export const Gradients = {
  cyan: ['#19D3E0', '#0891B2'],
  blue: ['#3B9CFF', '#1D5FE0'],
  green: ['#19C9A0', '#0D9488'],
  purple: ['#8B5CF6', '#5B3FE0'],
  indigo: ['#6D6BFF', '#4338CA'],
  pink: ['#FF5C9D', '#E0357A'],
  orange: ['#FFB050', '#F2760A'],
} as const;

export type GradientKey = keyof typeof Gradients;
