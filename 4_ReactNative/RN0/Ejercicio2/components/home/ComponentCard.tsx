import { Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';

import { Text, View, useThemeColor } from '@/components/Themed';
import { Fonts } from '@/constants/Fonts';
import { Gradients } from '@/constants/gradients';
import type { ComponentEntry } from '@/constants/componentsCatalog';
import ComponentThumbnail from './ComponentThumbnail';

export default function ComponentCard({ item }: { item: ComponentEntry }) {
  const surface = useThemeColor({}, 'surface');
  const border = useThemeColor({}, 'border');
  const muted = useThemeColor({}, 'textMuted');
  const colors = Gradients[item.color];
  const router = useRouter();

  return (
    <Pressable
      onPress={() => router.push({ pathname: '/componentes/[name]', params: { name: item.id } })}
        accessibilityRole="button"
        accessibilityLabel={`Ver demo de ${item.name}`}
        style={({ pressed }) => [
          styles.card,
          { backgroundColor: surface, borderColor: border, opacity: pressed ? 0.7 : 1 },
        ]}>
        <LinearGradient colors={[...colors]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.badge}>
          <Ionicons name={item.icon} size={28} color="#fff" />
        </LinearGradient>

        <View style={styles.text} lightColor="transparent" darkColor="transparent">
          <Text style={styles.name} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.7}>
            {item.name}
          </Text>
          <Text style={[styles.usage, { color: muted }]} numberOfLines={3}>
            {item.usage}
          </Text>
        </View>

        <Ionicons name="chevron-forward" size={20} color={muted} />
        <ComponentThumbnail id={item.id} accent={colors[0]} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderRadius: 22,
    borderWidth: 1,
    padding: 12,
    minHeight: 92,
  },
  badge: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    flex: 1,
    gap: 2,
  },
  name: {
    fontFamily: Fonts.bold,
    fontSize: 17,
  },
  usage: {
    fontFamily: Fonts.regular,
    fontSize: 13,
    lineHeight: 18,
  },
});
