import { StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';

import { Text, View, useThemeColor } from '@/components/Themed';
import { useColorScheme } from '@/components/useColorScheme';
import ThemeToggleButton from '@/components/ThemeToggleButton';
import { HeroGradients } from '@/constants/Colors';
import { Fonts } from '@/constants/Fonts';
import { Gradients } from '@/constants/gradients';

// tres "pantallas" apiladas y rotadas, solo decoración
function PhoneDecoration() {
  const glow = useThemeColor({}, 'glow');
  const border = useThemeColor({}, 'border');

  return (
    <View style={styles.phones} pointerEvents="none" lightColor="transparent" darkColor="transparent">
      {[0, 1, 2].map((i) => (
        <LinearGradient
          key={i}
          colors={[`${glow}${i === 2 ? '55' : '22'}`, 'transparent']}
          style={[
            styles.phone,
            {
              borderColor: border,
              right: -30 + i * 34,
              top: 30 - i * 14,
              transform: [{ rotate: `${-14 + i * 6}deg` }],
            },
          ]}
        />
      ))}
    </View>
  );
}

export default function Hero() {
  const insets = useSafeAreaInsets();
  const muted = useThemeColor({}, 'textMuted');
  const scheme = useColorScheme() === 'dark' ? 'dark' : 'light';

  return (
    <LinearGradient colors={[...HeroGradients[scheme]]} style={[styles.hero, { paddingTop: insets.top + 16 }]}>
      <PhoneDecoration />

      <View style={styles.topRow} lightColor="transparent" darkColor="transparent">
        <LinearGradient colors={[...Gradients.cyan]} style={styles.logo}>
          <Ionicons name="cube" size={30} color="#fff" />
        </LinearGradient>
        <ThemeToggleButton />
      </View>

      <Text style={styles.title}>Componentes nativos</Text>
      <Text style={[styles.subtitle, { color: muted }]}>
        Tocá cualquier componente para ver una demo funcionando y para qué se usa en una app real.
      </Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  hero: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    overflow: 'hidden',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  logo: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontFamily: Fonts.extrabold,
    fontSize: 40,
    lineHeight: 44,
    letterSpacing: -1,
    maxWidth: '78%',
  },
  subtitle: {
    fontFamily: Fonts.regular,
    fontSize: 15,
    lineHeight: 22,
    marginTop: 12,
    maxWidth: '80%',
  },
  phones: {
    ...StyleSheet.absoluteFill,
  },
  phone: {
    position: 'absolute',
    width: 150,
    height: 210,
    borderRadius: 26,
    borderWidth: 1,
  },
});
