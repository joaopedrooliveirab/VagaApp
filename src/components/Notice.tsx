import type { ReactNode } from 'react';

import { StyleSheet, Text, View } from 'react-native';

import { colors } from '../constants/theme';

import { Icon } from './Icon';

type NoticeProps = {
  title: string;
  children: ReactNode;
};

// Aviso fixo de que o conteúdo é demonstrativo. Usa ícone e texto,
// sem depender apenas da cor.
export function Notice({ title, children }: NoticeProps) {
  return (
    <View style={styles.notice} accessible accessibilityRole="summary">
      <Icon name="info" color={colors.primary} size={22} />

      <View style={styles.body}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.text}>{children}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  notice: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: colors.surface,
    borderColor: colors.lightCoral,
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
  },

  body: {
    flex: 1,
    gap: 4,
  },

  title: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '700',
  },

  text: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 20,
  },
});
