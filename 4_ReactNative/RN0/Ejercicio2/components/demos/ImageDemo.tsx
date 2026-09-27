import { Image, StyleSheet } from 'react-native';

import { Text, View } from '@/components/Themed';

export default function ImageDemo() {
  return (
    <View style={styles.row} lightColor="transparent" darkColor="transparent">
      <View style={styles.item} lightColor="transparent" darkColor="transparent">
        <Image source={require('../../assets/icon.png')} style={styles.image} />
        <Text style={styles.caption}>Local (require)</Text>
      </View>
      <View style={styles.item} lightColor="transparent" darkColor="transparent">
        <Image source={{ uri: 'https://picsum.photos/seed/rn0/200/200' }} style={styles.image} />
        <Text style={styles.caption}>Remota (uri)</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 20,
    justifyContent: 'center',
  },
  item: {
    alignItems: 'center',
    gap: 6,
  },
  image: {
    width: 88,
    height: 88,
    borderRadius: 12,
  },
  caption: {
    fontSize: 12,
  },
});
