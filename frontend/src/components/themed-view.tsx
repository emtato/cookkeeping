import { View, type ViewProps } from 'react-native';

import { ThemeColour } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type ThemedViewProps = ViewProps & {
  lightColour?: string;
  darkColour?: string;
  type?: ThemeColour;
};

export function ThemedView({ style, lightColour, darkColour, type, ...otherProps }: ThemedViewProps) {
  const theme = useTheme();

  return <View style={[{ backgroundColor: theme[type ?? 'background'] }, style]} {...otherProps} />;
}
