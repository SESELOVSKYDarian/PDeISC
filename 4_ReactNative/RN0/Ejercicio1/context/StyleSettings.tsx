import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

import { COLOR_OPTIONS, DENSITY_OPTIONS, FONT_OPTIONS, SHAPE_OPTIONS } from '@/constants/styleOptions';

type StyleSettingsValue = {
  color: (typeof COLOR_OPTIONS)[number];
  font: (typeof FONT_OPTIONS)[number];
  density: (typeof DENSITY_OPTIONS)[number];
  shape: (typeof SHAPE_OPTIONS)[number];
  cycleColor: () => void;
  cycleFont: () => void;
  cycleDensity: () => void;
  cycleShape: () => void;
};

const StyleSettingsContext = createContext<StyleSettingsValue | null>(null);

export function StyleSettingsProvider({ children }: { children: ReactNode }) {
  const [colorIndex, setColorIndex] = useState(0);
  const [fontIndex, setFontIndex] = useState(0);
  const [densityIndex, setDensityIndex] = useState(0);
  const [shapeIndex, setShapeIndex] = useState(0);

  const value = useMemo<StyleSettingsValue>(
    () => ({
      color: COLOR_OPTIONS[colorIndex],
      font: FONT_OPTIONS[fontIndex],
      density: DENSITY_OPTIONS[densityIndex],
      shape: SHAPE_OPTIONS[shapeIndex],
      cycleColor: () => setColorIndex((i) => (i + 1) % COLOR_OPTIONS.length),
      cycleFont: () => setFontIndex((i) => (i + 1) % FONT_OPTIONS.length),
      cycleDensity: () => setDensityIndex((i) => (i + 1) % DENSITY_OPTIONS.length),
      cycleShape: () => setShapeIndex((i) => (i + 1) % SHAPE_OPTIONS.length),
    }),
    [colorIndex, fontIndex, densityIndex, shapeIndex]
  );

  return <StyleSettingsContext.Provider value={value}>{children}</StyleSettingsContext.Provider>;
}

export function useStyleSettings() {
  const ctx = useContext(StyleSettingsContext);
  if (!ctx) {
    throw new Error('useStyleSettings debe usarse dentro de StyleSettingsProvider');
  }
  return ctx;
}
