import { useState } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

import { colors } from '../constants/theme';
import { Icon } from './Icon';

type LogoutControlProps = {
  onPress: () => void;
  accessibilityLabel?: string;
};

export function LogoutControl({
  onPress,
  accessibilityLabel = 'Sair do painel',
}: LogoutControlProps) {
  const [focused, setFocused] = useState(false);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={({ pressed }) => [
        styles.control,
        focused && styles.focused,
        pressed && styles.pressed,
      ]}
    >
      <Icon name="logout" color={colors.primary} size={20} />
      <Text style={styles.label}>Sair</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  control: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    minWidth: 44,
    minHeight: 44,
    paddingHorizontal: 8,
    backgroundColor: 'transparent',
    borderRadius: 6,
  },

  focused: {
    outlineColor: colors.primary,
    outlineWidth: 2,
    outlineStyle: 'solid',
  },

  pressed: { opacity: 0.7 },

  label: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: '700',
  },
});
