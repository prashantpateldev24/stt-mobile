import { useEffect } from 'react';
import { StatusBar } from 'react-native';
import Toast from 'react-native-toast-message';
import * as SplashScreen from 'expo-splash-screen';
import { Stack, useRouter, useSegments } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';

import { AuthProvider, useAuthContext } from '@/src/features/auth/context/AuthContext';
import { queryClient, clientPersister } from '@/src/services/queryClient';
import { useOfflineSync } from '@/src/features/offline/hooks/useOfflineSync';
import { OfflineBanner } from '@/src/features/offline/components/OfflineBanner';

SplashScreen.preventAutoHideAsync().then();

const RootNavigation = () => {
  const { user, isLoading } = useAuthContext();
  const segments = useSegments();
  const router = useRouter();

  useOfflineSync();

  useEffect(() => {
    if (isLoading) return;

    const isPublicScreen = ['login', 'signup', 'verify-otp'].includes(segments[0]);

    if (!user && !isPublicScreen) {
      router.replace('/login');
    } else if (user && isPublicScreen) {
      router.replace('/(tabs)');
    }
  }, [user, isLoading, segments]);

  return (
    <>
      <OfflineBanner />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="login" />
        <Stack.Screen name="signup" />
        <Stack.Screen name="verify-otp" />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="tasks/create"
          options={{ presentation: 'modal', headerShown: true, title: 'Create Task' }}
        />
        <Stack.Screen name="tasks/[id]" options={{ headerShown: true, title: 'Edit Task' }} />
        <Stack.Screen
          name="habits/create"
          options={{ presentation: 'modal', headerShown: true, title: 'Create Habit' }}
        />
        <Stack.Screen name="habits/[id]" options={{ headerShown: true, title: 'Edit Habit' }} />
      </Stack>
      <Toast />
    </>
  );
};

const RootLayout = () => {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" />
      <PersistQueryClientProvider
        client={queryClient}
        persistOptions={{ persister: clientPersister }}
      >
        <AuthProvider>
          <RootNavigation />
        </AuthProvider>
      </PersistQueryClientProvider>
    </SafeAreaProvider>
  );
};

export default RootLayout;
