import React, { useState } from 'react';
import { StatusBar, StyleSheet, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import BodyMetricsScreen from './src/screens/BodyMetricsScreen';
import type { Theme } from './src/theme/colors';

export default function App() {
  const systemScheme = useColorScheme();
  const [theme, setTheme] = useState<Theme>(systemScheme === 'dark' ? 'dark' : 'light');

  return (
    <SafeAreaProvider>
      <StatusBar
        barStyle={theme === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor="transparent"
        translucent
      />
      <BodyMetricsScreen
        theme={theme}
        onThemeToggle={() => setTheme(t => (t === 'light' ? 'dark' : 'light'))}
      />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({});
