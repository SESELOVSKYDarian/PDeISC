import { useState } from 'react';
import { Button, StyleSheet } from 'react-native';

import { Text, useThemeColor } from '@/components/Themed';

export default function ButtonDemo() {
  const [count, setCount] = useState(0);
  const tint = useThemeColor({}, 'tint');

  return (
    <>
      <Button title="Sumar 1" onPress={() => setCount((c) => c + 1)} color={tint} />
      <Text style={styles.count}>Contador: {count}</Text>
    </>
  );
}

const styles = StyleSheet.create({
  count: {
    marginTop: 12,
    fontSize: 15,
    textAlign: 'center',
  },
});
