import { useState } from 'react';
import { Link } from 'expo-router';

import {
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Brand } from '../components/Brand';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Icon } from '../components/Icon';
import { Screen } from '../components/Screen';
import { Title } from '../components/Title';

import { colors, sharedStyles } from '../constants/theme';
import { useAuth } from '../context/AuthContext';

export default function LoginScreen() {
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [otherAccessOpen, setOtherAccessOpen] = useState(false);
  const [accessFocused, setAccessFocused] = useState(false);

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

      <View style={styles.otherAccess}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Outras formas de acesso"
          accessibilityState={{ expanded: otherAccessOpen }}
          aria-expanded={otherAccessOpen}
          accessibilityHint={otherAccessOpen ? 'Recolher os acessos TEIA e empresa' : 'Expandir os acessos TEIA e empresa'}
          onPress={() => setOtherAccessOpen((open) => !open)}
          onFocus={() => setAccessFocused(true)}
          onBlur={() => setAccessFocused(false)}
          style={({ pressed }) => [
            styles.accessToggle,
            accessFocused && styles.focused,
            pressed && styles.pressed,
          ]}
        >
          <Text style={styles.accessLabel}>Outras formas de acesso</Text>
          <Icon name={otherAccessOpen ? 'collapse' : 'expand'} color={colors.primary} size={20} />
        </Pressable>
        {otherAccessOpen && (
          <View style={styles.accessLinks}>
            <Link href="/admin-login" style={[sharedStyles.link, styles.accessLink]}>
              Área administrativa TEIA
            </Link>
            <Link href="/empresa-login" style={[sharedStyles.link, styles.accessLink]}>
              Área da empresa
            </Link>
          </View>
        )}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  otherAccess: { marginTop: 26, gap: 8 },
  accessToggle: {
    alignSelf: 'center',
    maxWidth: '100%',
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 12,
    borderRadius: 6,
  },
  accessLabel: { color: colors.primary, fontSize: 16, fontWeight: '600', flexShrink: 1 },
  focused: { outlineColor: colors.primary, outlineWidth: 2, outlineStyle: 'solid' },
  pressed: { opacity: 0.7 },
  accessLinks: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    padding: 8,
    gap: 4,
  },
  accessLink: { minHeight: 44, lineHeight: 22, textAlign: 'left' },
});
