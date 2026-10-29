import type { ReactNode } from 'react';

import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

import {
  SafeAreaView,
  type Edge,
} from 'react-native-safe-area-context';

import { colors } from '../constants/theme';
import { useResponsive } from '../hooks/use-responsive';

type ScreenProps = {
  children: ReactNode;
  // Login e cadastro ficam centralizados; telas de conteúdo, no topo.
  centered?: boolean;
  // Bordas que recebem a área segura. Abas e cabeçalhos já cobrem as demais.
  edges?: Edge[];
  // Largura máxima do conteúdo em celulares.
  maxWidth?: number;
  // Largura máxima em tablets e telas largas.
  wideMaxWidth?: number;
};

export function Screen({
  children,
  centered = true,
  edges,
  maxWidth = 440,
  wideMaxWidth = 560,
}: ScreenProps) {
  const { compact, wide } = useResponsive();

  // Celulares pequenos ganham espaço com margens menores.
  const padding = compact
    ? { paddingHorizontal: 16, paddingVertical: 24 }
    : wide
      ? { paddingHorizontal: 32, paddingVertical: 40 }
      : { paddingHorizontal: 24, paddingVertical: 36 };

  return (
    <SafeAreaView style={styles.safe} edges={edges}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={[
            styles.scroll,
            padding,
            centered && styles.centered,
          ]}
          keyboardShouldPersistTaps="handled"
        >
          <View
            style={[
              styles.content,
              { maxWidth: wide ? wideMaxWidth : maxWidth },
            ]}
          >
            {children}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },

  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },

  scroll: {
    flexGrow: 1,
  },

  centered: {
    justifyContent: 'center',
  },

  content: {
    width: '100%',
    alignSelf: 'center',
  },
});
