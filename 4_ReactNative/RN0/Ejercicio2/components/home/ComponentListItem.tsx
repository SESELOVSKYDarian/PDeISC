import { Pressable, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

import { Text, View, useThemeColor } from '@/components/Themed';
import { TextStyles } from '@/constants/Typography';
import type { ComponentEntry } from '@/constants/componentsCatalog';

export default function ComponentListItem({
  item,
  accent,
  isLast,
}: {
  item: ComponentEntry;
  accent: string;
  isLast: boolean;
}) {
  const muted = useThemeColor({}, 'textMuted');
  const border = useThemeColor({}, 'border');

  return (
    <Link href={{ pathname: '/componentes/[name]', params: { name: item.id } }} asChild>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Ver demo de ${item.name}`}
        hitSlop={4}
        style={({ pressed }) => [styles.row, pressed && { opacity: 0.5 }]}>
        <View style={[styles.iconBadge, { backgroundColor: accent }]} lightColor="transparent" darkColor="transparent">
          <Ionicons name={item.icon} size={22} color="#fff" />
        </View>
        <View style={[styles.rowInner, !isLast && { borderBottomColor: border, borderBottomWidth: StyleSheet.hairlineWidth }]}>
          <Text style={styles.name}>{item.name}</Text>
          <Ionicons name="chevron-forward" size={18} color={muted} />
        </View>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingLeft: 18,
    minHeight: 60,
  },
  iconBadge: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowInner: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: 18,
    paddingVertical: 16,
  },
  name: {
    ...TextStyles.body,
  },
});
