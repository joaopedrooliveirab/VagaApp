import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '../constants/theme';

type Option<T extends string | number> = {
  value: T;
  label: string;
};

type SegmentedControlProps<T extends string | number> = {
  label: string;
  options: readonly Option<T>[];
  value: T;
  onChange: (value: T) => void;
};

export function SegmentedControl<T extends string | number>({
  label,
  options,
  value,
  onChange,
}: SegmentedControlProps<T>) {
  return (
    <View
      style={styles.group}
      accessibilityRole="tablist"
      accessibilityLabel={label}
    >
      {options.map((option) => {
        const selected = option.value === value;

        return (
          <Pressable
            key={option.value}
            accessibilityRole="tab"
            accessibilityState={{ selected }}
            onPress={() => onChange(option.value)}
            style={[styles.option, selected && styles.selected]}
          >
            <Text
              style={[styles.text, selected && styles.selectedText]}
            >
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  group: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 12,
    padding: 4,
    gap: 4,
  },

  option: {
    flex: 1,
    minHeight: 44,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },

  selected: {
    backgroundColor: colors.primary,
  },

  text: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '600',
  },

  selectedText: {
    color: '#FFFFFF',
  },
});
