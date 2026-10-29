import { StyleSheet, Text, View } from 'react-native';

import { colors } from '../constants/theme';

type TagProps = {
  label: string;
  variant?: 'filled' | 'outline';
};

export function Tag({ label, variant = 'filled' }: TagProps) {
  return (
    <View
      style={[
        styles.tag,
        variant === 'outline' && styles.outline,
      ]}
    >
      <Text style={styles.text}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tag: {
    alignSelf: 'flex-start',
    backgroundColor: colors.veryLight,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.veryLight,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },

  outline: {
    backgroundColor: colors.background,
    borderColor: colors.lightCoral,
  },

  text: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '600',
  },
});
