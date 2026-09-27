import { ScrollView, StyleSheet } from 'react-native';
import type { ReactNode } from 'react';

import { Text, View, useThemeColor } from '@/components/Themed';
import { TextStyles } from '@/constants/Typography';

type Props = {
  name: string;
  usage: string;
  /** true para demos que traen su propia lista/scroll (FlatList, SectionList, RefreshControl) */
  fullHeight?: boolean;
  children: ReactNode;
};

export default function DemoScreen({ name, usage, fullHeight, children }: Props) {
  const surface = useThemeColor({}, 'surface');
  const muted = useThemeColor({}, 'textMuted');

  const header = (
    <>
      <Text style={styles.title}>{name}</Text>
      <Text style={[styles.usage, { color: muted }]}>{usage}</Text>
      <Text style={[styles.sectionLabel, { color: muted }]}>DEMO EN VIVO</Text>
    </>
  );

  if (fullHeight) {
    return (
      <View style={styles.fullHeightWrapper}>
        <View style={styles.headerPad}>{header}</View>
        <View style={[styles.demoBox, styles.demoBoxFull, { backgroundColor: surface }]}>{children}</View>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      {header}
      <View style={[styles.demoBox, { backgroundColor: surface }]}>{children}</View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 16,
    paddingBottom: 48,
  },
  fullHeightWrapper: {
    flex: 1,
    padding: 16,
  },
  headerPad: {
    marginBottom: 4,
  },
  title: {
    ...TextStyles.title1,
  },
  usage: {
    ...TextStyles.subhead,
    marginTop: 6,
    marginBottom: 20,
  },
  sectionLabel: {
    ...TextStyles.footnote,
    marginBottom: 6,
    marginLeft: 4,
  },
  demoBox: {
    borderRadius: 10,
    padding: 16,
    minHeight: 140,
    justifyContent: 'center',
  },
  demoBoxFull: {
    flex: 1,
  },
});
