import { Tabs } from 'expo-router/js-tabs';

import { Icon } from '../../../components/Icon';
import { colors } from '../../../constants/theme';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.muted,
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopColor: colors.border,
        },
        // A barra tem altura fixa: o rótulo não acompanha a fonte do sistema.
        tabBarAllowFontScaling: false,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          // No navegador o rótulo encolhia e era cortado.
          flexShrink: 0,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Icon name="home" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="vagas"
        options={{
          title: 'Vagas',
          tabBarIcon: ({ color, size }) => (
            <Icon name="jobs" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="curriculo"
        options={{
          title: 'Currículo',
          tabBarIcon: ({ color, size }) => (
            <Icon name="resume" color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
