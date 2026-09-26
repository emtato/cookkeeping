import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useColorScheme as useColourScheme } from 'react-native';

import TabManager from '@/TabRouters/TabManager';

SplashScreen.preventAutoHideAsync();

export default function App() {
  const colourScheme = useColourScheme();
  return (
    <ThemeProvider value={colourScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <TabManager />
    </ThemeProvider>
  );
}
