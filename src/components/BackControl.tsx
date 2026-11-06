import { useState } from 'react';
import { router, type Href } from 'expo-router';
import { Pressable, StyleSheet, Text } from 'react-native';

import { colors } from '../constants/theme';
import { Icon } from './Icon';

type BackControlProps = {
  label: string;
  href: Href;
  history?: boolean;
  accessibilityLabel?: string;
};

export function BackControl({
  label,
  href,
  history = false,
  accessibilityLabel = `Voltar para ${label}`,
}: BackControlProps) {
  const [focused, setFocused] = useState(false);

  function handlePress() {
    if (history && router.canGoBack()) router.back();
    else router.dismissTo(href);
  }

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={handlePress}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={({ pressed }) => [
        styles.control,
        focused && styles.focused,
        pressed && styles.pressed,
      ]}
    >
      <Icon name="back" color={colors.primary} size={20} />
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  control: {
    alignSelf: 'flex-start',
    maxWidth: '100%',
    minWidth: 44,
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 8,
    marginBottom: 12,
    backgroundColor: 'transparent',
    borderRadius: 6,
  },
  focused: { outlineColor: colors.primary, outlineWidth: 2, outlineStyle: 'solid' },
  pressed: { opacity: 0.7 },
  label: { color: colors.primary, fontSize: 16, fontWeight: '600', flexShrink: 1 },
});
