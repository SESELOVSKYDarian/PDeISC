import { Fonts } from './Fonts';

// Escala de Dynamic Type de iOS (tamaño "Large", el default del sistema).
// https://developer.apple.com/design/human-interface-guidelines/typography
export const TextStyles = {
  largeTitle: { fontSize: 34, lineHeight: 41, fontFamily: Fonts.extrabold },
  title1: { fontSize: 28, lineHeight: 34, fontFamily: Fonts.bold },
  title2: { fontSize: 22, lineHeight: 28, fontFamily: Fonts.bold },
  title3: { fontSize: 20, lineHeight: 25, fontFamily: Fonts.semibold },
  headline: { fontSize: 17, lineHeight: 22, fontFamily: Fonts.semibold },
  body: { fontSize: 17, lineHeight: 22, fontFamily: Fonts.regular },
  callout: { fontSize: 16, lineHeight: 21, fontFamily: Fonts.regular },
  subhead: { fontSize: 15, lineHeight: 20, fontFamily: Fonts.regular },
  footnote: { fontSize: 13, lineHeight: 18, fontFamily: Fonts.regular },
  caption1: { fontSize: 12, lineHeight: 16, fontFamily: Fonts.regular },
} as const;
