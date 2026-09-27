import { FlatList, StyleSheet } from 'react-native';

import { Text, View, useThemeColor } from '@/components/Themed';
import { Fonts } from '@/constants/Fonts';

const FRUITS = ['Manzana', 'Banana', 'Cereza', 'Durazno', 'Frutilla', 'Kiwi', 'Mango', 'Naranja'];

export default function FlatListDemo() {
  const border = useThemeColor({}, 'border');

  return (
    <FlatList
      data={FRUITS}
      keyExtractor={(item) => item}
      ItemSeparatorComponent={() => <View style={[styles.separator, { backgroundColor: border }]} />}
      renderItem={({ item, index }) => (
        <View style={styles.row} lightColor="transparent" darkColor="transparent">
          <Text style={styles.index}>{index + 1}</Text>
          <Text style={styles.label}>{item}</Text>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 12,
    paddingVertical: 10,
  },
  index: {
    width: 24,
    fontFamily: Fonts.bold,
    opacity: 0.5,
  },
  label: {
    fontSize: 15,
    fontFamily: Fonts.regular,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
  },
});
