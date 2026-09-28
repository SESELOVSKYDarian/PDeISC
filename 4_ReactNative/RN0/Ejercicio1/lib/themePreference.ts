import AsyncStorage from '@react-native-async-storage/async-storage';
import { Appearance } from 'react-native';

const KEY = 'theme-preference';

export type ThemeChoice = 'light' | 'dark';

// leo el tema guardado y lo aplico antes de mostrar la app
export async function loadThemePreference() {
  try {
    const saved = await AsyncStorage.getItem(KEY);
    if (saved === 'light' || saved === 'dark') {
      Appearance.setColorScheme(saved);
    }
  } catch {
    // sin storage seguimos con el tema del sistema
  }
}

// aplico el tema elegido y lo guardo
export async function setThemePreference(choice: ThemeChoice) {
  Appearance.setColorScheme(choice);
  try {
    await AsyncStorage.setItem(KEY, choice);
  } catch {
    // si falla el guardado, el cambio igual queda aplicado en esta sesión
  }
}
