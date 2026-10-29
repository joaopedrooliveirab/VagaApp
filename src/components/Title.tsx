import type { ReactNode } from 'react';

import { StyleSheet, Text, type TextStyle } from 'react-native';

import { sharedStyles } from '../constants/theme';
import { useResponsive } from '../hooks/use-responsive';

type TitleProps = {
  children: ReactNode;
  style?: TextStyle;
};

// Título de tela: menor em celulares pequenos, para não ocupar linhas demais.
export function Title({ children, style }: TitleProps) {
  const { compact } = useResponsive();

  return (
    <Text
      accessibilityRole="header"
      style={[sharedStyles.title, compact && styles.compact, style]}
    >
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  compact: {
    fontSize: 26,
    marginBottom: 8,
  },
});
