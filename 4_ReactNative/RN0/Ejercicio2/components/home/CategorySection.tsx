import { StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

import { Text, View, useThemeColor } from '@/components/Themed';
import { Fonts } from '@/constants/Fonts';
import ComponentCard from './ComponentCard';
import type { Category } from '@/constants/componentsCatalog';

export default function CategorySection({ category }: { category: Category }) {
  const muted = useThemeColor({}, 'textMuted');

  return (
    <View style={styles.section} lightColor="transparent" darkColor="transparent">
      <View style={styles.header} lightColor="transparent" darkColor="transparent">
        <Ionicons name={category.icon} size={22} color={muted} />
        <Text style={[styles.title, { color: muted }]}>{category.title.toUpperCase()}</Text>
      </View>
      <View style={styles.list} lightColor="transparent" darkColor="transparent">
        {category.items.map((item) => (
          <ComponentCard key={item.id} item={item} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 28,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 14,
  },
  title: {
    fontFamily: Fonts.medium,
    fontSize: 15,
    letterSpacing: 0.5,
  },
  list: {
    gap: 12,
  },
});
