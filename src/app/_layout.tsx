import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AnalysisProvider } from '../context/AnalysisContext';
import {
  AuthProvider,
  useAuth,
} from '../context/AuthContext';

function Routes() {
  const { user } = useAuth();

  return (
    // A chave reinicia vaga, currículo e resultado quando a sessão muda.
    <AnalysisProvider key={user?.email ?? 'visitante'}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Protected guard={!user}>
          <Stack.Screen name="index" />
          <Stack.Screen name="cadastro" />
          <Stack.Screen name="admin-login" />
        </Stack.Protected>

        <Stack.Protected guard={user?.role === 'aluno'}>
          <Stack.Screen name="(aluno)" />
        </Stack.Protected>

        <Stack.Protected guard={user?.role === 'administrativo'}>
          <Stack.Screen name="(admin)" />
        </Stack.Protected>
      </Stack>
    </AnalysisProvider>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <StatusBar style="dark" />
        <Routes />
      </AuthProvider>
    </SafeAreaProvider>
  );
}
