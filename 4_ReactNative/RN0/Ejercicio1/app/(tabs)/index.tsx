import { StyleSheet } from 'react-native';
import Animated, { FadeInDown, ZoomIn } from 'react-native-reanimated';
import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';

import { Text, View, useThemeColor } from '@/components/Themed';
import { useStyleSettings } from '@/context/StyleSettings';

export default function InicioScreen() {
  const muted = useThemeColor({}, 'textMuted');
  const { color, font, density, shape } = useStyleSettings();

  return (
    <View style={[styles.container, { padding: density.padding }]}>
      <Animated.View key={`badge-${color.value}-${shape.name}`} entering={ZoomIn.duration(400)}>
        <LinearGradient
          colors={[color.value, `${color.value}CC`]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[
            styles.badge,
            { borderRadius: shape.radius },
            shape.shadow && { shadowColor: color.value, ...styles.badgeShadow },
          ]}>
          <Ionicons name="rocket-outline" size={40} color="#fff" />
        </LinearGradient>
      </Animated.View>

      <Animated.View
        key={`text-${font.name}`}
        entering={FadeInDown.duration(400).delay(80)}
        style={styles.textBlock}>
        <Text style={[styles.title, { fontFamily: font.family }]}>Hola Mundo</Text>
        <Text style={[styles.subtitle, { color: muted }]}>
          Mi primer proyecto en React Native con Expo
        </Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    gap: 20,
  },
  badge: {
    width: 96,
    height: 96,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeShadow: {
    shadowOpacity: 0.35,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 8,
  },
  textBlock: {
    alignItems: 'center',
  },
  title: {
    fontSize: 34,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans_400Regular',
    textAlign: 'center',
    lineHeight: 22,
    marginTop: 8,
  },
});
