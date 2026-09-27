import { useState } from 'react';
import { Modal, Pressable, StyleSheet } from 'react-native';

import { Text, View, useThemeColor } from '@/components/Themed';
import { Fonts } from '@/constants/Fonts';

export default function ModalDemo() {
  const [visible, setVisible] = useState(false);
  const tint = useThemeColor({}, 'tint');
  const surface = useThemeColor({}, 'surface');

  return (
    <>
      <Pressable
        onPress={() => setVisible(true)}
        style={({ pressed }) => [styles.button, { backgroundColor: tint, opacity: pressed ? 0.85 : 1 }]}>
        <Text style={styles.buttonText}>Abrir modal</Text>
      </Pressable>

      <Modal visible={visible} animationType="slide" transparent onRequestClose={() => setVisible(false)}>
        <View style={styles.overlay} lightColor="rgba(15,23,42,0.45)" darkColor="rgba(0,0,0,0.65)">
          <View style={[styles.sheet, { backgroundColor: surface }]}>
            <View style={styles.grabber} lightColor="#CBD5E1" darkColor="#334155" />
            <Text style={styles.sheetTitle}>Contenido flotante</Text>
            <Text style={styles.sheetText}>Este bloque aparece encima de toda la pantalla.</Text>
            <Pressable
              onPress={() => setVisible(false)}
              style={({ pressed }) => [styles.button, { backgroundColor: tint, opacity: pressed ? 0.85 : 1 }]}>
              <Text style={styles.buttonText}>Cerrar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  button: {
    alignSelf: 'center',
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 14,
    minHeight: 44,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  buttonText: {
    color: '#fff',
    fontFamily: Fonts.semibold,
  },
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  sheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingTop: 12,
    gap: 12,
  },
  grabber: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 8,
  },
  sheetTitle: {
    fontSize: 18,
    fontFamily: Fonts.bold,
  },
  sheetText: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    marginBottom: 8,
  },
});
