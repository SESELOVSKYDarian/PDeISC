import { useState } from 'react';
import { StyleSheet, TouchableWithoutFeedback } from 'react-native';

import { Text, View, useThemeColor } from '@/components/Themed';
import { Fonts } from '@/constants/Fonts';

export default function TouchableWithoutFeedbackDemo() {
  const [count, setCount] = useState(0);
  const border = useThemeColor({}, 'border');

  return (
    <TouchableWithoutFeedback onPress={() => setCount((c) => c + 1)}>
      <View style={[styles.box, { borderColor: border }]} lightColor="transparent" darkColor="transparent">
        <Text style={styles.text}>Sin efecto visual al tocar</Text>
        <Text style={styles.count}>Toques detectados: {count}</Text>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  box: {
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderRadius: 16,
    padding: 22,
    alignItems: 'center',
    gap: 6,
  },
  text: {
    fontSize: 14,
    fontFamily: Fonts.regular,
  },
  count: {
    fontSize: 15,
    fontFamily: Fonts.semibold,
  },
});
