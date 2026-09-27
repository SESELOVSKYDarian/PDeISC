import { SectionList, StyleSheet } from 'react-native';

import { Text, useThemeColor } from '@/components/Themed';
import { Fonts } from '@/constants/Fonts';

const SECTIONS = [
  { title: 'Frutas', data: ['Manzana', 'Banana', 'Cereza'] },
  { title: 'Verduras', data: ['Zanahoria', 'Zapallo', 'Espinaca'] },
];

export default function SectionListDemo() {
  const tint = useThemeColor({}, 'tint');
  const surface = useThemeColor({}, 'surface');

  return (
    <SectionList
      sections={SECTIONS}
      keyExtractor={(item) => item}
      renderSectionHeader={({ section }) => (
        <Text style={[styles.header, { color: tint, backgroundColor: surface }]}>{section.title}</Text>
      )}
      renderItem={({ item }) => <Text style={styles.item}>{item}</Text>}
      stickySectionHeadersEnabled
    />
  );
}

const styles = StyleSheet.create({
  header: {
    fontFamily: Fonts.bold,
    fontSize: 13,
    letterSpacing: 1,
    textTransform: 'uppercase',
    paddingVertical: 8,
  },
  item: {
    fontSize: 15,
    fontFamily: Fonts.regular,
    paddingVertical: 8,
  },
});
