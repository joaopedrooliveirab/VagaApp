import { useState } from 'react';

import {
  StyleSheet,
  Text,
  TextInput,
  View,
  type TextInputProps,
} from 'react-native';

import { colors } from '../constants/theme';

type InputProps = TextInputProps & {
  label: string;
};

export function Input({
  label,
  onFocus,
  onBlur,
  style,
  ...props
}: InputProps) {
  const [focused, setFocused] = useState(false);

  return (
    <View style={styles.group}>
      <Text style={styles.label}>{label}</Text>

      <TextInput
        {...props}
        accessibilityLabel={label}
        placeholderTextColor={colors.muted}
        style={[
          styles.input,
          focused && styles.focused,
          style,
        ]}
        onFocus={(event) => {
          setFocused(true);
          onFocus?.(event);
        }}
        onBlur={(event) => {
          setFocused(false);
          onBlur?.(event);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  group: {
    gap: 8,
  },

  label: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '600',
  },

  input: {
    color: colors.text,
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 10,
    minHeight: 52,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 16,
  },

  focused: {
    borderColor: colors.primary,
    borderWidth: 2,
    paddingHorizontal: 13,
    paddingVertical: 13,
  },
});