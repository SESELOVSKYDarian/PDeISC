import { ScrollView, StyleSheet } from 'react-native';

import { Text, View } from '@/components/Themed';
import { Fonts } from '@/constants/Fonts';

const CHIPS = ['Manzana', 'Banana', 'Cereza', 'Durazno', 'Frutilla', 'Kiwi', 'Mango'];

export default function ScrollViewDemo() {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}>
      {CHIPS.map((chip) => (
        <View key={chip} style={styles.chip} lightColor="#E5F2FF" darkColor="#0A2540">
          <Text style={styles.chipText}>{chip}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    gap: 10,
    paddingHorizontal: 4,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  chipText: {
    fontSize: 14,
    fontFamily: Fonts.semibold,
  },
});
