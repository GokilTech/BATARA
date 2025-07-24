// app/_layout.tsx

import { Stack, useRouter, useSegments } from "expo-router";

import { useEffect } from "react"; // Tambahkan import ini

import { ActivityIndicator, View } from "react-native"; // Tambahkan import ini

import { GestureHandlerRootView } from "react-native-gesture-handler";

import { AuthProvider, useAuth } from "../context/AuthContext"; // Tambahkan import ini

import {
  configureReanimatedLogger,
  ReanimatedLogLevel,
} from 'react-native-reanimated';

import "./globals.css";

const InitialLayout = () => {
    const { session, loading } = useAuth();
    const router = useRouter();

    const segments = useSegments();

    useEffect(() => {
    if (loading) return;

    const inPublicGroup = segments[0] === "(public)";

    if (session && inPublicGroup) {
      router.replace("/(Auth)/(tabs)/home");
    } else if (!session && !inPublicGroup) {
      router.replace("/(public)/sign-in");
    }
  }, [session, loading, segments, router]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  } // Karena layout ini mengontrol Stack, kita render Stack di sini.

  return <Stack screenOptions={{ headerShown: false }} />;
};

configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false, // Reanimated runs in strict mode by default
});

// Ini adalah Root Layout yang sebenarnya

export default function RootLayout() {
  return (
    <AuthProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <InitialLayout />
      </GestureHandlerRootView>
    </AuthProvider>
  );
}