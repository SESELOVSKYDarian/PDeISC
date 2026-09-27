import { StyleSheet } from 'react-native';

import { View } from '@/components/Themed';

export default function ViewDemo() {
  return (
    <View style={styles.row} lightColor="transparent" darkColor="transparent">
      <View style={[styles.box, { backgroundColor: '#0EA5E9' }]} />
      <View style={[styles.box, { backgroundColor: '#22C55E' }]} />
      <View style={[styles.box, { backgroundColor: '#F97316' }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'center',
  },
  box: {
    width: 56,
    height: 56,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
});
