import { StyleSheet, Text, View } from 'react-native';

import { colors } from '../constants/theme';

type RankListProps = {
  items: { label: string; value: number }[];
  unit: string;
  limit?: number;
};

// Barras horizontais: o valor fica na ponta de cada barra, por isso
// elas ocupam no máximo 85% da largura.
const MAX_BAR_PERCENT = 85;

export function RankList({ items, unit, limit = 5 }: RankListProps) {
  const visible = items.slice(0, limit);
  const max = Math.max(...visible.map((item) => item.value), 1);

  if (visible.length === 0) {
    return (
      <Text style={styles.empty}>Sem dados para o período.</Text>
    );
  }

  return (
    <View style={styles.list} accessibilityRole="list">
      {visible.map((item) => (
        <View
          key={item.label}
          style={styles.item}
          accessible
          accessibilityLabel={`${item.label}: ${item.value} ${unit}`}
        >
          <Text style={styles.label}>{item.label}</Text>

          <View style={styles.barRow}>
            <View
              style={[
                styles.bar,
                {
                  width: `${(item.value / max) * MAX_BAR_PERCENT}%`,
                },
              ]}
            />

            <Text style={styles.value}>{item.value}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: 16,
  },

  item: {
    gap: 6,
  },

  label: {
    color: colors.text,
    fontSize: 14,
  },

  barRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  bar: {
    height: 10,
    backgroundColor: colors.primary,
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
  },

  value: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '700',
  },

  empty: {
    color: colors.muted,
    fontSize: 14,
  },
});
