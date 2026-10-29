import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
} from 'react-native';

import { colors } from '../constants/theme';

type ButtonProps = {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'outline';
  disabled?: boolean;
  loading?: boolean;
};

export function Button({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
}: ButtonProps) {
  const outline = variant === 'outline';
  const inactive = disabled || loading;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: inactive, busy: loading }}
      disabled={inactive}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        outline && styles.outline,
        pressed && styles.pressed,
        disabled && styles.disabled,
      ]}
    >
      {loading && (
        <ActivityIndicator
          color={outline ? colors.primary : '#FFFFFF'}
        />
      )}

      <Text style={[styles.text, outline && styles.outlineText]}>
        {title}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
    borderWidth: 2,
    minHeight: 52,
    borderRadius: 12,
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
  },

  outline: {
    backgroundColor: colors.background,
  },

  pressed: {
    opacity: 0.8,
  },

  disabled: {
    opacity: 0.45,
  },

  text: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },

  outlineText: {
    color: colors.primary,
  },
});
