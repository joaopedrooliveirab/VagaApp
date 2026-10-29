import { useWindowDimensions } from 'react-native';

// Faixas de largura (em pontos) usadas para adaptar o layout.
const COMPACT_BELOW = 360; // celulares pequenos
const WIDE_FROM = 768; // tablets e telas largas

export function useResponsive() {
  const { width } = useWindowDimensions();

  return {
    width,
    compact: width < COMPACT_BELOW,
    wide: width >= WIDE_FROM,
  };
}
