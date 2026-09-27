import { StyleSheet } from 'react-native';

import { Text, useThemeColor } from '@/components/Themed';
import { Fonts } from '@/constants/Fonts';

export default function TextDemo() {
  const tint = useThemeColor({}, 'tint');

  return (
    <>
      <Text style={styles.bold}>Texto en negrita</Text>
      <Text style={styles.italic}>Texto en cursiva</Text>
      <Text style={[styles.colored, { color: tint }]}>Texto con color</Text>
      <Text numberOfLines={1} style={styles.truncate}>
        Texto largo que se corta con puntos suspensivos al llegar al límite del ancho disponible
      </Text>
    </>
  );
}

const styles = StyleSheet.create({
  bold: {
    fontFamily: Fonts.bold,
    fontSize: 16,
    marginBottom: 8,
  },
  italic: {
    fontFamily: Fonts.italic,
    fontSize: 16,
    marginBottom: 8,
  },
  colored: {
    fontFamily: Fonts.semibold,
    fontSize: 16,
    marginBottom: 8,
  },
  truncate: {
    fontFamily: Fonts.regular,
    fontSize: 16,
  },
});
