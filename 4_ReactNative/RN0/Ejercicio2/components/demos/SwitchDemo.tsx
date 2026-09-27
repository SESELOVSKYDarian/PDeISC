import { useState } from 'react';
import { StyleSheet, Switch } from 'react-native';

import { Text, View, useThemeColor } from '@/components/Themed';
import { Fonts } from '@/constants/Fonts';

export default function SwitchDemo() {
  const [enabled, setEnabled] = useState(false);
  const tint = useThemeColor({}, 'tint');

  return (
    <View style={styles.row} lightColor="transparent" darkColor="transparent">
      <Switch
        value={enabled}
        onValueChange={setEnabled}
        trackColor={{ false: '#CBD5E1', true: tint }}
      />
      <Text style={styles.label}>{enabled ? 'Activado' : 'Desactivado'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    justifyContent: 'center',
  },
  label: {
    fontSize: 15,
    fontFamily: Fonts.semibold,
  },
});
