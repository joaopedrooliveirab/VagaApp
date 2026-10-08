import { StyleSheet, Text, View } from 'react-native';

import { colors } from '../constants/theme';

export function Brand() {
  return (
    <View
      style={styles.brand}
      accessible
      accessibilityLabel="Aluno, marca do aplicativo"
    >
      <View style={styles.symbol}>
        <Text style={styles.letter}>A</Text>
      </View>

      <Text style={styles.name}>
        aluno<Text style={styles.dot}>.</Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 38,
  },

  symbol: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },

  letter: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '800',
  },

  name: {
    color: colors.text,
    fontSize: 26,
    fontWeight: '700',
  },

  dot: {
    color: colors.primary,
  },
});