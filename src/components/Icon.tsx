import { SymbolView } from 'expo-symbols';

import type { ColorValue } from 'react-native';

// iOS usa SF Symbols; Android e web usam Material Symbols.
const symbols = {
  back: { ios: 'arrow.left', android: 'arrow_back', web: 'arrow_back' },
  expand: { ios: 'chevron.down', android: 'expand_more', web: 'expand_more' },
  collapse: { ios: 'chevron.up', android: 'expand_less', web: 'expand_less' },
  home: { ios: 'house.fill', android: 'home', web: 'home' },
  jobs: { ios: 'briefcase.fill', android: 'work', web: 'work' },
  resume: {
    ios: 'doc.text.fill',
    android: 'description',
    web: 'description',
  },
  pdf: {
    ios: 'doc.richtext.fill',
    android: 'picture_as_pdf',
    web: 'picture_as_pdf',
  },
  upload: {
    ios: 'square.and.arrow.up',
    android: 'upload_file',
    web: 'upload_file',
  },
  logout: {
    ios: 'rectangle.portrait.and.arrow.right',
    android: 'logout',
    web: 'logout',
  },
  check: {
    ios: 'checkmark.circle.fill',
    android: 'check_circle',
    web: 'check_circle',
  },
  pending: {
    ios: 'circle',
    android: 'radio_button_unchecked',
    web: 'radio_button_unchecked',
  },
  gap: {
    ios: 'exclamationmark.circle.fill',
    android: 'error',
    web: 'error',
  },
  tip: { ios: 'lightbulb.fill', android: 'lightbulb', web: 'lightbulb' },
  info: {
    ios: 'info.circle.fill',
    android: 'info',
    web: 'info',
  },
  location: {
    ios: 'mappin.and.ellipse',
    android: 'location_on',
    web: 'location_on',
  },
  company: {
    ios: 'building.2.fill',
    android: 'business',
    web: 'business',
  },
  level: {
    ios: 'graduationcap.fill',
    android: 'school',
    web: 'school',
  },
  mode: { ios: 'house.and.flag.fill', android: 'laptop', web: 'laptop' },
  swap: {
    ios: 'arrow.triangle.2.circlepath',
    android: 'swap_horiz',
    web: 'swap_horiz',
  },
  play: { ios: 'play.fill', android: 'play_arrow', web: 'play_arrow' },
  shield: {
    ios: 'lock.shield.fill',
    android: 'admin_panel_settings',
    web: 'admin_panel_settings',
  },
} as const;

export type IconName = keyof typeof symbols;

type IconProps = {
  name: IconName;
  color: ColorValue;
  size?: number;
};

export function Icon({ name, color, size = 24 }: IconProps) {
  return (
    <SymbolView
      name={symbols[name]}
      tintColor={color}
      size={size}
    />
  );
}
