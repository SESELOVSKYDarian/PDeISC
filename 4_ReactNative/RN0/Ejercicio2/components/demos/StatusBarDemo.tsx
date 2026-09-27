import { useState } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';

import { Text, useThemeColor } from '@/components/Themed';
import { Fonts } from '@/constants/Fonts';

export default function StatusBarDemo() {
  const [style, setStyle] = useState<'light' | 'dark'>('dark');
  const tint = useThemeColor({}, 'tint');

  return (
    <>
      <StatusBar style={style} />
      <Text style={styles.hint}>Cambia el color de los íconos de la barra de estado (arriba del todo).</Text>
      <Pressable
        onPress={() => setStyle((s) => (s === 'dark' ? 'light' : 'dark'))}
        style={({ pressed }) => [styles.button, { backgroundColor: tint, opacity: pressed ? 0.85 : 1 }]}>
        <Text style={styles.buttonText}>Estilo actual: {style}</Text>
      </Pressable>
    </>
  );
}

const styles = StyleSheet.create({
  hint: {
    fontSize: 13,
    fontFamily: Fonts.regular,
    marginBottom: 12,
  },
  button: {
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  buttonText: {
    color: '#fff',
    fontFamily: Fonts.semibold,
  },
});
