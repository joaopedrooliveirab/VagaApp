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

export default function CadastroScreen() {
  const { register } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  function handleRegister() {
    Keyboard.dismiss();

    const result = register({
      name,
      email,
      password,
      confirmPassword,
    });

    setError(result.ok ? '' : result.message);
  }

  return (
    <Screen>
      <Brand />

      <Title>Crie sua conta</Title>

      <Text style={sharedStyles.subtitle}>
        Seu primeiro passo começa aqui.
      </Text>

      <View style={sharedStyles.form}>
        <Input
          label="Nome"
          placeholder="Seu nome"
          value={name}
          onChangeText={(value) => {
            setName(value);
            setError('');
          }}
          autoCapitalize="words"
          autoComplete="name"
        />

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
          placeholder="Pelo menos 6 caracteres"
          value={password}
          onChangeText={(value) => {
            setPassword(value);
            setError('');
          }}
          secureTextEntry
          autoCapitalize="none"
          autoCorrect={false}
          autoComplete="new-password"
        />

        <Input
          label="Confirmar senha"
          placeholder="Repita sua senha"
          value={confirmPassword}
          onChangeText={(value) => {
            setConfirmPassword(value);
            setError('');
          }}
          secureTextEntry
          autoCapitalize="none"
          autoCorrect={false}
          autoComplete="new-password"
          returnKeyType="go"
          onSubmitEditing={handleRegister}
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
          title="Criar conta"
          onPress={handleRegister}
        />
      </View>

      <View style={sharedStyles.footer}>
        <Text style={sharedStyles.muted}>
          Já possui uma conta?
        </Text>

        <Link
          href="/"
          replace
          style={sharedStyles.link}
        >
          Voltar para Login
        </Link>
      </View>
    </Screen>
  );
}