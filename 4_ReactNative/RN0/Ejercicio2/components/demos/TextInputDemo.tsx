import { useState } from 'react';
import { StyleSheet, TextInput } from 'react-native';

import { Text, useThemeColor } from '@/components/Themed';
import { Fonts } from '@/constants/Fonts';

export default function TextInputDemo() {
  const [value, setValue] = useState('');
  const border = useThemeColor({}, 'border');
  const color = useThemeColor({}, 'text');
  const muted = useThemeColor({}, 'textMuted');

  return (
    <>
      <TextInput
        value={value}
        onChangeText={setValue}
        placeholder="Escribí tu nombre"
        placeholderTextColor="#94A3B8"
        style={[styles.input, { borderColor: border, color }]}
      />
      <Text style={[styles.count, { color: muted }]}>
        {value.length === 0 ? 'Sin texto todavía' : `Escribiste "${value}" (${value.length} caracteres)`}
      </Text>
    </>
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1.5,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    fontFamily: Fonts.regular,
    marginBottom: 10,
  },
  count: {
    fontSize: 13,
    fontFamily: Fonts.regular,
  },
});
