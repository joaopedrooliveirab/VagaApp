import { useState } from 'react';
import { Keyboard, Text, View } from 'react-native';

import { Brand } from '../components/Brand';
import { BackControl } from '../components/BackControl';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Screen } from '../components/Screen';
import { Title } from '../components/Title';
import { sharedStyles } from '../constants/theme';
import { useAuth } from '../context/AuthContext';

export default function CompanyLoginScreen() {
  const { loginCompany } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  function handleLogin() {
    Keyboard.dismiss();
    const result = loginCompany({ email, password });
    setError(result.ok ? '' : result.message);
  }

  return (
    <Screen>
      <BackControl label="Voltar" href="/" history accessibilityLabel="Voltar ao acesso do aluno" />
      <Brand />
      <Title style={{ marginTop: 16 }}>Área da empresa</Title>
      <Text style={sharedStyles.subtitle}>
        Consulte suas vagas e converse com a equipe TEIA.
      </Text>
      <View style={sharedStyles.form}>
        <Input
          label="E-mail" placeholder="E-mail da empresa" value={email}
          onChangeText={(value) => { setEmail(value); setError(''); }}
          keyboardType="email-address" autoCapitalize="none"
          autoCorrect={false} autoComplete="email"
        />
        <Input
          label="Senha" placeholder="Sua senha" value={password}
          onChangeText={(value) => { setPassword(value); setError(''); }}
          secureTextEntry autoCapitalize="none" autoCorrect={false}
          autoComplete="current-password" returnKeyType="go" onSubmitEditing={handleLogin}
        />
        {!!error && (
          <Text style={sharedStyles.error} accessibilityRole="alert" accessibilityLiveRegion="polite">
            {error}
          </Text>
        )}
        <Button title="Entrar" onPress={handleLogin} />
        <Text style={sharedStyles.muted}>Ambiente demonstrativo com dados fictícios.</Text>
      </View>
    </Screen>
  );
}
