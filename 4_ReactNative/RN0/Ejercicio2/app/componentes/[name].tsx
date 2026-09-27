import { Stack, useLocalSearchParams } from 'expo-router';

import { Text, View } from '@/components/Themed';
import DemoScreen from '@/components/DemoScreen';
import { DEMO_REGISTRY } from '@/components/demos/registry';
import { findComponentEntry } from '@/constants/componentsCatalog';

export default function ComponentDetailScreen() {
  const { name } = useLocalSearchParams<{ name: string }>();
  const entry = findComponentEntry(name);
  const Demo = entry ? DEMO_REGISTRY[entry.id] : undefined;

  if (!entry || !Demo) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Componente no encontrado.</Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: entry.name }} />
      <DemoScreen name={entry.name} usage={entry.usage} fullHeight={entry.fullHeight}>
        <Demo />
      </DemoScreen>
    </>
  );
}
