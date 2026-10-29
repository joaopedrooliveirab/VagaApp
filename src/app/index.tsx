import { useState } from 'react';
import { Link } from 'expo-router';

import {
  Keyboard,
  Text,
  View,
} from 'react-native';

import { Brand } from '../components/Brand';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Screen } from '../components/Screen';
import { Title } from '../components/Title';

import { sharedStyles } from '../constants/theme';
import { useAuth } from '../context/AuthContext';

export default function LoginScreen() {
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  function handleLogin() {
    Keyboard.dismiss();

    const result = login({
      email,
      password,
    });

    setError(result.ok ? '' : result.message);
  }

  return (
    <Screen>
      <Brand />

      <Title>Bem-vindo de volta</Title>

      <Text style={sharedStyles.subtitle}>
        Entre na sua conta para continuar.
      </Text>

      <View style={sharedStyles.form}>
        <Input
          label="E-mail"
          placeholder="Seu e-mail"
          value={email}
          onChangeText={(value) => {
            setEmail(value);
            setError('');
          }}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          autoComplete="email"
        />

        <Input
          label="Senha"
          placeholder="Sua senha"
          value={password}
          onChangeText={(value) => {
            setPassword(value);
            setError('');
          }}
          secureTextEntry
          autoCapitalize="none"
          autoCorrect={false}
          autoComplete="current-password"
          returnKeyType="go"
          onSubmitEditing={handleLogin}
        />

        {!!error && (
          <Text
            style={sharedStyles.error}
            accessibilityRole="alert"
            accessibilityLiveRegion="polite"
          >
            {error}
          </Text>
        )}

        <Button
          title="Entrar"
          onPress={handleLogin}
        />
      </View>

      <View style={sharedStyles.footer}>
        <Text style={sharedStyles.muted}>
          Não possui uma conta?
        </Text>

        <Link
          href="/cadastro"
          style={sharedStyles.link}
        >
          Criar conta
        </Link>
      </View>

      <View style={sharedStyles.footer}>
        <Text style={sharedStyles.muted}>
          Você faz parte da equipe TEIA?
        </Text>

        <Link
          href="/admin-login"
          style={sharedStyles.link}
        >
          Acessar área administrativa
        </Link>
      </View>
    </Screen>
  );
}