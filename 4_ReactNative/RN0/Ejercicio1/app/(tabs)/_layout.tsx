import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from 'expo-router';
import type { ColorValue } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import ThemeToggleButton from '@/components/ThemeToggleButton';
import { StyleSettingsProvider } from '@/context/StyleSettings';

type IconName = React.ComponentProps<typeof Ionicons>['name'];

function TabBarIcon({ name, color }: { name: IconName; color: ColorValue }) {
  return <Ionicons size={24} name={name} color={color} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme === 'dark' ? 'dark' : 'light'];
  const insets = useSafeAreaInsets();

  return (
    <StyleSettingsProvider>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: theme.tint,
          tabBarInactiveTintColor: theme.tabIconDefault,
          tabBarStyle: {
            backgroundColor: theme.surface,
            borderTopColor: theme.border,
            height: 56 + insets.bottom,
            paddingBottom: insets.bottom + 6,
            paddingTop: 8,
          },
          tabBarLabelStyle: { fontFamily: 'PlusJakartaSans_600SemiBold', fontSize: 12 },
          headerStyle: { backgroundColor: theme.surface },
          headerTitleStyle: { color: theme.text, fontFamily: 'PlusJakartaSans_700Bold' },
          headerRight: () => <ThemeToggleButton />,
          headerRightContainerStyle: { paddingRight: 16 },
        }}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Inicio',
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />
            ),
            tabBarAccessibilityLabel: 'Pestaña Inicio',
          }}
        />
        <Tabs.Screen
          name="two"
          options={{
            title: 'Estilos',
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon name={focused ? 'color-palette' : 'color-palette-outline'} color={color} />
            ),
            tabBarAccessibilityLabel: 'Pestaña Estilos',
          }}
        />
      </Tabs>
    </StyleSettingsProvider>
  );
}
