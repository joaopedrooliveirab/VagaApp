import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Brand } from '../components/Brand';
import { Button } from '../components/Button';
import { Screen } from '../components/Screen';

import {
  colors,
  sharedStyles,
} from '../constants/theme';

import { useAuth } from '../context/AuthContext';

export default function HomeScreen() {
  const { user, logout } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <Screen>
      <Brand />

      <Text
        style={sharedStyles.title}
        accessibilityRole="header"
      >
        Olá, {user.name} 👋
      </Text>

      <Text style={sharedStyles.subtitle}>
        Que bom ter você por aqui.
      </Text>

      <View style={styles.card}>
        <Text style={styles.heading}>
          Você está conectado
        </Text>

        <Text style={styles.body}>
          Seu acesso foi realizado com sucesso.
        </Text>

        <Text style={styles.email}>
          {user.email}
        </Text>
      </View>

      <Button
        title="Sair"
        onPress={logout}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
    padding: 22,
    marginBottom: 28,
    gap: 10,
  },

  heading: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '700',
  },

  body: {
    color: colors.muted,
    fontSize: 15,
    lineHeight: 22,
  },

  email: {
    color: colors.text,
    fontSize: 15,
  },
});