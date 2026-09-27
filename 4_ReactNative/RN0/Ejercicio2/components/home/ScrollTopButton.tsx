import { Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';

import { useThemeColor } from '@/components/Themed';

type Props = {
  visible: boolean;
  onPress: () => void;
};

export default function ScrollTopButton({ visible, onPress }: Props) {
  const tint = useThemeColor({}, 'tint');
  const surface = useThemeColor({}, 'surface');
  const insets = useSafeAreaInsets();

  if (!visible) return null;

  return (
    <Pressable
      onPress={onPress}
      accessibilityLabel="Subir arriba"
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: surface, bottom: 20 + insets.bottom, opacity: pressed ? 0.7 : 1 },
      ]}>
      <Ionicons name="chevron-up" size={20} color={tint} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    right: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
});
