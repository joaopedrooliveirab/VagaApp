import { StyleSheet, Text, View } from 'react-native';

import { colors, sharedStyles } from '../constants/theme';

import { Button } from './Button';

type EmptyStateProps = {
  title: string;
  message: string;
} & ({ actionLabel: string; onAction: () => void } | { actionLabel?: never; onAction?: never });

export function EmptyState({
  title,
  message,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <View style={styles.box}>
      <Text style={sharedStyles.sectionTitle} accessibilityRole="header">
        {title}
      </Text>

      <Text style={styles.message}>{message}</Text>

      {actionLabel && onAction && <Button title={actionLabel} onPress={onAction} />}
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    gap: 12,
  },

  message: {
    color: colors.muted,
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 8,
  },
});
