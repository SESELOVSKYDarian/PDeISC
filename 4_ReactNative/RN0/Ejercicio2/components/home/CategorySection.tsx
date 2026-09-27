import { StyleSheet } from 'react-native';

import { Text, View, useThemeColor } from '@/components/Themed';
import { TextStyles } from '@/constants/Typography';
import { CategoryAccents } from '@/constants/Colors';
import ComponentListItem from './ComponentListItem';
import type { Category } from '@/constants/componentsCatalog';

export default function CategorySection({ category }: { category: Category }) {
  const surface = useThemeColor({}, 'surface');
  const muted = useThemeColor({}, 'textMuted');
  const tint = useThemeColor({}, 'tint');
  const accent = CategoryAccents[category.id] ?? tint;

  return (
    <View style={styles.section} lightColor="transparent" darkColor="transparent">
      <Text style={[styles.title, { color: muted }]}>{category.title.toUpperCase()}</Text>
      <View style={[styles.card, { backgroundColor: surface }]}>
        {category.items.map((item, index) => (
          <ComponentListItem
            key={item.id}
            item={item}
            accent={accent}
            isLast={index === category.items.length - 1}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 24,
  },
  title: {
    ...TextStyles.footnote,
    marginBottom: 6,
    paddingHorizontal: 16,
  },
  card: {
    borderRadius: 10,
    overflow: 'hidden',
  },
});
