import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

import { Text, View, useThemeColor } from '@/components/Themed';
import { Fonts } from '@/constants/Fonts';

export default function ActivityIndicatorDemo() {
  const [loading, setLoading] = useState(false);
  const tint = useThemeColor({}, 'tint');

  const simulate = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <View style={styles.wrapper} lightColor="transparent" darkColor="transparent">
      {loading ? (
        <ActivityIndicator size="large" color={tint} />
      ) : (
        <Ionicons name="checkmark-circle" size={40} color="#34C759" />
      )}
      <Pressable
        onPress={simulate}
        disabled={loading}
        style={({ pressed }) => [
          styles.button,
          { backgroundColor: tint, opacity: loading ? 0.5 : pressed ? 0.85 : 1 },
        ]}>
        <Text style={styles.buttonText}>{loading ? 'Cargando...' : 'Simular carga (2s)'}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    gap: 16,
  },
  button: {
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 14,
    minHeight: 44,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  buttonText: {
    color: '#fff',
    fontFamily: Fonts.semibold,
  },
});
