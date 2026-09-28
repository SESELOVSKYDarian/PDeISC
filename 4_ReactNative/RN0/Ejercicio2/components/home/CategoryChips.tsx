import { Pressable, ScrollView, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { Text, View, useThemeColor } from '@/components/Themed';
import { Fonts } from '@/constants/Fonts';
import { Gradients } from '@/constants/gradients';
import { CATALOG } from '@/constants/componentsCatalog';

type Props = {
  selected: string;
  onSelect: (id: string) => void;
};

const OPTIONS = [{ id: 'all', label: 'Todos' }, ...CATALOG.map((c) => ({ id: c.id, label: c.short }))];

export default function CategoryChips({ selected, onSelect }: Props) {
  const surface = useThemeColor({}, 'surface');
  const border = useThemeColor({}, 'border');
  const text = useThemeColor({}, 'text');
  const glow = useThemeColor({}, 'glow');

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
      style={styles.scroll}>
      {OPTIONS.map((option) => {
        const active = option.id === selected;
        return (
          <Pressable
            key={option.id}
            onPress={() => onSelect(option.id)}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
            style={({ pressed }) => [pressed && { opacity: 0.7 }]}>
            {active ? (
              <LinearGradient
                colors={[...Gradients.cyan]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[styles.chip, { shadowColor: glow }, styles.chipGlow]}>
                <Text style={styles.activeLabel} lightColor="#00232B" darkColor="#00232B">
                  {option.label}
                </Text>
              </LinearGradient>
            ) : (
              <View style={[styles.chip, { backgroundColor: surface, borderColor: border, borderWidth: 1 }]}>
                <Text style={[styles.label, { color: text }]}>{option.label}</Text>
              </View>
            )}
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 0,
  },
  row: {
    gap: 10,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  chip: {
    height: 44,
    borderRadius: 22,
    paddingHorizontal: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipGlow: {
    shadowOpacity: 0.45,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  label: {
    fontFamily: Fonts.medium,
    fontSize: 15,
  },
  activeLabel: {
    fontFamily: Fonts.bold,
    fontSize: 15,
  },
});
