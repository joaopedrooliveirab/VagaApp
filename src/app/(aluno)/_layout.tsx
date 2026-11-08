import { Stack } from 'expo-router';

import { colors } from '../../constants/theme';

// As abas ficam na primeira tela; detalhes, revisão e resultado
// abrem por cima delas. A vaga usa o retorno dentro do conteúdo.
export default function AlunoLayout() {
  return (
    <Stack
      screenOptions={{
        headerTintColor: colors.primary,
        headerTitleStyle: { color: colors.text },
        headerShadowVisible: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen
        name="(tabs)"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="vaga/[id]"
        options={{ title: 'Detalhes da vaga', headerShown: false }}
      />
      <Stack.Screen name="revisao" options={{ title: 'Revisão' }} />
      <Stack.Screen
        name="resultado"
        options={{ title: 'Resultado da análise' }}
      />
    </Stack>
  );
}
