/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import { Colours } from '@/constants/theme';
import { useColourScheme } from '@/hooks/use-colour-scheme';

export function useTheme() {
  const scheme = useColourScheme();
  const theme = scheme === 'unspecified' ? 'light' : scheme;

  return Colours[theme];
}
