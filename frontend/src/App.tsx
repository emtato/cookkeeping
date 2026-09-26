import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useColorScheme } from 'react-native';

import TabManager from '@/TabRouters/TabManager';

SplashScreen.preventAutoHideAsync();

export default function App() {
  const colorScheme = useColorScheme();
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <TabManager />
    </ThemeProvider>
  );
}
