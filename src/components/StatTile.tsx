import { StyleSheet, Text, View } from 'react-native';

import { colors } from '../constants/theme';

type StatTileProps = {
  label: string;
  value: number;
};

export function StatTile({ label, value }: StatTileProps) {
  return (
    <View
      style={styles.tile}
      accessible
      accessibilityLabel={`${label}: ${value}`}
    >
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tile: {
    flex: 1,
    minWidth: 100,
    backgroundColor: colors.surface,
    borderColor: '#E2E8F0',
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    gap: 4,
  },

  value: {
    color: colors.text,
    fontSize: 30,
    fontWeight: '700',
  },

  label: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 18,
  },
});
