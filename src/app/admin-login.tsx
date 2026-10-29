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
import { Tag } from '../components/Tag';
import { Title } from '../components/Title';

import { sharedStyles } from '../constants/theme';
import { useAuth } from '../context/AuthContext';

export default function AdminLoginScreen() {
  const { loginAdmin } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  function handleLogin() {
    Keyboard.dismiss();

    const result = loginAdmin({
      email,
      password,
    });

    setError(result.ok ? '' : result.message);
  }

  return (
    <Screen>
      <Brand />

      <Tag label="Área administrativa — TEIA" />

      <Title style={{ marginTop: 16 }}>Acesso da equipe</Title>

      <Text style={sharedStyles.subtitle}>
        Entre com a credencial administrativa para ver o painel.
      </Text>

      <View style={sharedStyles.form}>
        <Input
          label="E-mail"
          placeholder="E-mail administrativo"
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
          title="Entrar no painel"
          onPress={handleLogin}
        />
      </View>

      <View style={sharedStyles.footer}>
        <Link
          href="/"
          replace
          style={sharedStyles.link}
        >
          Voltar ao acesso do aluno
        </Link>
      </View>
    </Screen>
  );
}
