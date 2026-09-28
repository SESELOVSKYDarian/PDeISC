import { ImageBackground, StyleSheet } from 'react-native';

import { Text } from '@/components/Themed';
import { Fonts } from '@/constants/Fonts';

export default function ImageBackgroundDemo() {
  return (
    <ImageBackground
      source={{ uri: 'https://picsum.photos/seed/rn0bg/600/300' }}
      style={styles.background}
      imageStyle={styles.image}>
      <Text style={styles.text} lightColor="#fff" darkColor="#fff">
        Texto sobre una imagen de fondo
      </Text>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    height: 150,
    justifyContent: 'flex-end',
    padding: 14,
  },
  image: {
    borderRadius: 14,
  },
  text: {
    fontFamily: Fonts.bold,
    fontSize: 16,
    textShadowColor: 'rgba(0,0,0,0.6)',
    textShadowRadius: 6,
  },
});
