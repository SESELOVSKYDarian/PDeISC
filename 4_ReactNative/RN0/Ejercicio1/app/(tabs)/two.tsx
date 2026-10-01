import { Pressable, ScrollView, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

import { Text, View, useThemeColor } from '@/components/Themed';
import { Fonts } from '@/constants/Fonts';
import { useStyleSettings } from '@/context/StyleSettings';

type IconName = React.ComponentProps<typeof Ionicons>['name'];

function ControlRow({
  icon,
  label,
  value,
  onPress,
}: {
  icon: IconName;
  label: string;
  value: string;
  onPress: () => void;
}) {
  const accent = useThemeColor({}, 'accent');
  const surface = useThemeColor({}, 'surface');
  const border = useThemeColor({}, 'border');
  const muted = useThemeColor({}, 'textMuted');

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${label}: ${value}. Tocá para cambiar`}
      hitSlop={6}
      style={({ pressed }) => [
        styles.row,
        { backgroundColor: surface, borderColor: border, opacity: pressed ? 0.7 : 1 },
      ]}>
      <View style={[styles.rowIcon, { backgroundColor: `${accent}1F` }]} lightColor="transparent" darkColor="transparent">
        <Ionicons name={icon} size={18} color={accent} />
      </View>
      <View style={styles.rowText} lightColor="transparent" darkColor="transparent">
        <Text style={styles.rowLabel}>{label}</Text>
        <Text style={[styles.rowValue, { color: muted }]}>{value}</Text>
      </View>
      <Ionicons name="sync-outline" size={18} color={muted} />
    </Pressable>
  );
}

export default function EstilosScreen() {
  const muted = useThemeColor({}, 'textMuted');
  const surface = useThemeColor({}, 'surface');
  const border = useThemeColor({}, 'border');
  const { color, font, density, shape, cycleColor, cycleFont, cycleDensity, cycleShape } =
    useStyleSettings();
  // Guardo el color en una variable para no usar ".value" dentro del style
  const tint = color.value;

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}>
      <Text style={[styles.eyebrow, { color: tint }]}>PERSONALIZÁ EN VIVO</Text>
      <Text style={styles.title}>Estilos</Text>
      <Text style={[styles.subtitle, { color: muted }]}>
        Tocá cada opción para cambiar cómo se ve toda la app, incluida la pestaña Inicio.
      </Text>

      <View
        style={[
          styles.preview,
          {
            backgroundColor: surface,
            borderColor: border,
            borderRadius: shape.radius,
            padding: density.padding,
          },
          shape.shadow && styles.previewShadow,
        ]}>
        <View
          style={[styles.previewBadge, { backgroundColor: tint, borderRadius: shape.radius / 1.6 }]}
          lightColor="transparent"
          darkColor="transparent">
          <Ionicons name="color-wand-outline" size={32} color="#fff" />
        </View>
        <Text style={[styles.previewText, { fontFamily: font.family, color: tint }]}>Hola Mundo</Text>
      </View>

      <View style={styles.controls} lightColor="transparent" darkColor="transparent">
        <ControlRow icon="color-palette-outline" label="Color" value={color.name} onPress={cycleColor} />
        <ControlRow icon="text-outline" label="Tipografía" value={font.name} onPress={cycleFont} />
        <ControlRow icon="grid-outline" label="Layout" value={density.name} onPress={cycleDensity} />
        <ControlRow icon="sparkles-outline" label="Estilo" value={shape.name} onPress={cycleShape} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 48,
  },
  eyebrow: {
    fontSize: 12,
    fontFamily: Fonts.bold,
    letterSpacing: 1.5,
  },
  title: {
    fontSize: 34,
    fontFamily: Fonts.extrabold,
    letterSpacing: -0.5,
    marginTop: 4,
  },
  subtitle: {
    fontSize: 15,
    fontFamily: Fonts.regular,
    lineHeight: 21,
    marginTop: 8,
    marginBottom: 24,
  },
  preview: {
    borderWidth: 1,
    alignItems: 'center',
    gap: 16,
    marginBottom: 24,
  },
  previewShadow: {
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },
  previewBadge: {
    width: 72,
    height: 72,
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewText: {
    fontSize: 24,
  },
  controls: {
    gap: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    minHeight: 44,
  },
  rowIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowText: {
    flex: 1,
  },
  rowLabel: {
    fontSize: 15,
    fontFamily: Fonts.semibold,
  },
  rowValue: {
    fontSize: 13,
    fontFamily: Fonts.regular,
    marginTop: 1,
  },
});
