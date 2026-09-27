import { useRef, useState } from 'react';
import { ScrollView, StyleSheet, type NativeSyntheticEvent, type NativeScrollEvent } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Text, View } from '@/components/Themed';
import { TextStyles } from '@/constants/Typography';
import CategorySection from '@/components/home/CategorySection';
import ScrollTopButton from '@/components/home/ScrollTopButton';
import { CATALOG } from '@/constants/componentsCatalog';

const SCROLL_TOP_THRESHOLD = 300;

export default function HomeScreen() {
  const scrollRef = useRef<ScrollView>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const insets = useSafeAreaInsets();

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    setShowScrollTop(event.nativeEvent.contentOffset.y > SCROLL_TOP_THRESHOLD);
  };

  return (
    <View style={styles.screen}>
      <ScrollView
        ref={scrollRef}
        contentContainerStyle={[styles.content, { paddingTop: insets.top + 12, paddingBottom: 48 + insets.bottom }]}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}>
        <Text style={styles.largeTitle}>Componentes nativos</Text>
        <Text style={styles.intro}>
          Tocá cualquier componente para ver una demo funcionando y para qué se usa en una app real.
        </Text>

        {CATALOG.map((category) => (
          <CategorySection key={category.id} category={category} />
        ))}
      </ScrollView>

      <ScrollTopButton
        visible={showScrollTop}
        onPress={() => scrollRef.current?.scrollTo({ y: 0, animated: true })}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
  },
  largeTitle: {
    ...TextStyles.largeTitle,
    marginBottom: 4,
  },
  intro: {
    ...TextStyles.subhead,
    opacity: 0.7,
    marginBottom: 20,
  },
});
