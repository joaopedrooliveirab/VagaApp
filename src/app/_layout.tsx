import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AnalysisProvider } from '../context/AnalysisContext';
import { ConversationsProvider } from '../context/ConversationsContext';
import { CompaniesProvider, useCompanies } from '../context/CompaniesContext';
import {
  AuthProvider,
  useAuth,
} from '../context/AuthContext';

function Routes() {
  const { user } = useAuth();
  const { companies } = useCompanies();
  const approvedCompany = user?.role === 'empresa' && companies.some(
    (company) => company.id === user.companyId && company.status === 'approved',
  );
  const destino =
    user?.role === 'aluno'
      ? '/home'
      : user?.role === 'administrativo'
        ? '/dashboard'
        : '/empresa/vagas';

  return (
    // A chave reinicia vaga, currículo e resultado quando a sessão muda.
    <AnalysisProvider key={user?.email ?? 'visitante'}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Protected guard={!user} redirectTo={destino}>
          <Stack.Screen name="index" />
          <Stack.Screen name="cadastro" />
          <Stack.Screen name="admin-login" />
          <Stack.Screen name="empresa-login" />
          <Stack.Screen name="empresa-cadastro" />
        </Stack.Protected>

        <Stack.Protected guard={user?.role === 'aluno'}>
          <Stack.Screen name="(aluno)" />
        </Stack.Protected>

        <Stack.Protected guard={user?.role === 'administrativo'}>
          <Stack.Screen name="(admin)" />
        </Stack.Protected>

        <Stack.Protected guard={approvedCompany}>
          <Stack.Screen name="(empresa)" />
        </Stack.Protected>
      </Stack>
    </AnalysisProvider>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <CompaniesProvider>
        <AuthProvider>
          {/* Mantém o histórico ao alternar de perfil na mesma execução. */}
          <ConversationsProvider>
            <StatusBar style="dark" />
            <Routes />
          </ConversationsProvider>
        </AuthProvider>
      </CompaniesProvider>
    </SafeAreaProvider>
  );
}
