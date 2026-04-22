import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { Colors } from '../constants/Config';
import * as Font from 'expo-font';
import { Inter_400Regular, Inter_700Bold } from '@expo-google-fonts/inter';

export default function RootLayout() {
  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        Inter_400Regular,
        Inter_700Bold,
      });
    }
    loadFonts();
  }, []);

  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: Colors.background,
          },
          headerTintColor: Colors.primary,
          headerTitleStyle: {
            fontFamily: 'Inter_700Bold',
          },
          contentStyle: {
            backgroundColor: Colors.background,
          },
        }}
      >
        <Stack.Screen name="index" options={{ title: 'MODA SCANNER', headerTitleAlign: 'center' }} />
        <Stack.Screen name="scanner" options={{ title: 'Scan Ticket', headerBackTitle: 'Back' }} />
        <Stack.Screen name="result" options={{ title: 'Verification Result', presentation: 'modal' }} />
      </Stack>
    </>
  );
}
