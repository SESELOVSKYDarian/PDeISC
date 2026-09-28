import { Pressable, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

import { useThemeColor } from '@/components/Themed';
import { useColorScheme } from '@/components/useColorScheme';
import { setThemePreference } from '@/lib/themePreference';

export default function ThemeToggleButton() {
  const isDark = useColorScheme() === 'dark';
  const surface = useThemeColor({}, 'surface');
  const border = useThemeColor({}, 'border');
  const text = useThemeColor({}, 'text');

  return (
    <Pressable
      onPress={() => setThemePreference(isDark ? 'light' : 'dark')}
      accessibilityRole="button"
      accessibilityLabel={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: surface, borderColor: border, opacity: pressed ? 0.6 : 1 },
      ]}>
      <Ionicons name={isDark ? 'sunny-outline' : 'moon-outline'} size={20} color={text} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
