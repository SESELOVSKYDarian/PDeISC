import { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, TextInput } from 'react-native';

import { Text, useThemeColor } from '@/components/Themed';
import { Fonts } from '@/constants/Fonts';

export default function KeyboardAvoidingViewDemo() {
  const [text, setText] = useState('');
  const border = useThemeColor({}, 'border');
  const color = useThemeColor({}, 'text');

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.wrapper}>
      <Text style={styles.hint}>Tocá el campo: el bloque sube para que el teclado no lo tape.</Text>
      <TextInput
        value={text}
        onChangeText={setText}
        placeholder="Escribí acá..."
        placeholderTextColor="#94A3B8"
        style={[styles.input, { borderColor: border, color }]}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: 10,
  },
  hint: {
    fontSize: 13,
    fontFamily: Fonts.regular,
  },
  input: {
    borderWidth: 1.5,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    fontFamily: Fonts.regular,
  },
});
