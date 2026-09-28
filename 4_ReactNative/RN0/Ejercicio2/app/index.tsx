import { useRef, useState } from 'react';
import { ScrollView, StyleSheet, type NativeSyntheticEvent, type NativeScrollEvent } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { View } from '@/components/Themed';
import CategoryChips from '@/components/home/CategoryChips';
import CategorySection from '@/components/home/CategorySection';
import Hero from '@/components/home/Hero';
import ScrollTopButton from '@/components/home/ScrollTopButton';
import { filterCatalog } from '@/constants/componentsCatalog';

const SCROLL_TOP_THRESHOLD = 300;

export default function HomeScreen() {
  const scrollRef = useRef<ScrollView>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [categoryId, setCategoryId] = useState('all');
  const insets = useSafeAreaInsets();

  const categories = filterCatalog(categoryId);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    setShowScrollTop(event.nativeEvent.contentOffset.y > SCROLL_TOP_THRESHOLD);
  };

  return (
    <View style={styles.screen}>
      <ScrollView
        ref={scrollRef}
        contentContainerStyle={{ paddingBottom: 48 + insets.bottom }}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <Hero />
        <CategoryChips selected={categoryId} onSelect={setCategoryId} />

        {categories.map((category) => (
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
});
