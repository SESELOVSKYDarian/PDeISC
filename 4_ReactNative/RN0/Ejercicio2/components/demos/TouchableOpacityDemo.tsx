import { useState } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

import { Text, useThemeColor } from '@/components/Themed';
import { Fonts } from '@/constants/Fonts';

export default function TouchableOpacityDemo() {
  const [count, setCount] = useState(0);
  const tint = useThemeColor({}, 'tint');

  return (
    <>
      <TouchableOpacity
        onPress={() => setCount((c) => c + 1)}
        activeOpacity={0.4}
        style={[styles.button, { backgroundColor: tint }]}>
        <Text style={styles.buttonText}>Tocá y soltá opacidad</Text>
      </TouchableOpacity>
      <Text style={styles.count}>Toques: {count}</Text>
    </>
  );
}

const styles = StyleSheet.create({
  button: {
    alignSelf: 'center',
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
  count: {
    marginTop: 12,
    fontSize: 15,
    fontFamily: Fonts.medium,
    textAlign: 'center',
  },
});
