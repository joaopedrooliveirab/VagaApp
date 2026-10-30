import { Stack } from 'expo-router';

export const unstable_settings = { initialRouteName: 'empresa/vagas/index' };

export default function CompanyLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="empresa/vagas/index" />
      <Stack.Screen name="empresa/vagas/[id]" />
      <Stack.Screen name="empresa/conversas/[id]" />
    </Stack>
  );
}
