import { Pressable, StyleSheet, Text } from 'react-native';

import { colors } from '../constants/theme';

type ButtonProps = {
  title: string;
  onPress: () => void;
};

export function Button({
  title,
  onPress,
}: ButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        pressed && styles.pressed,
      ]}
    >
      <Text style={styles.text}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    minHeight: 52,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 14,
  },

  pressed: {
    opacity: 0.8,
  },

  text: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});