import { useCallback, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet } from 'react-native';

import { Text, useThemeColor } from '@/components/Themed';
import { Fonts } from '@/constants/Fonts';

export default function RefreshControlDemo() {
  const [refreshing, setRefreshing] = useState(false);
  const [updatedAt, setUpdatedAt] = useState(new Date());
  const tint = useThemeColor({}, 'tint');
  const muted = useThemeColor({}, 'textMuted');

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setUpdatedAt(new Date());
      setRefreshing(false);
    }, 1200);
  }, []);

  return (
    <ScrollView
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={tint} />}>
      <Text style={styles.hint}>Deslizá hacia abajo para refrescar.</Text>
      <Text style={[styles.updated, { color: muted }]}>
        Última actualización: {updatedAt.toLocaleTimeString()}
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  hint: {
    fontSize: 15,
    fontFamily: Fonts.semibold,
  },
  updated: {
    fontSize: 13,
    fontFamily: Fonts.regular,
  },
});
