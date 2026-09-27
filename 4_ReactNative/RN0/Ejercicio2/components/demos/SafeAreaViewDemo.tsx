import { SafeAreaView, StyleSheet } from 'react-native';

import { Text } from '@/components/Themed';

export default function SafeAreaViewDemo() {
  return (
    <SafeAreaView style={styles.wrapper}>
      <Text style={styles.text}>
        Este bloque respeta el notch, la cámara y la barra de estado del dispositivo.
      </Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: 12,
    padding: 12,
    backgroundColor: 'rgba(14,165,233,0.12)',
  },
  text: {
    fontSize: 14,
    textAlign: 'center',
  },
});
