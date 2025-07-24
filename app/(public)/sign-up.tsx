import { View, Text, SafeAreaView, Image, TouchableOpacity } from "react-native";
import React from "react";
import { Stack, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context"; // 1. IMPORT HOOK INI

export default function RegisterScreen() {
    const router = useRouter();
    const { top } = useSafeAreaInsets(); // 2. Ambil nilai 'inset' area atas (status bar)

    return (
        // 3. Ubah warna dasar SafeAreaView jadi putih
        <SafeAreaView className="flex-1 bg-white">
            <Stack.Screen options={{ headerShown: false }} />

            {/* Bagian Header Biru */}
            <View
                className="h-2/5 bg-primary items-center justify-center p-8"
                // 4. INI TRIKNYA!
                style={{ paddingTop: top, marginTop: -top }}
            >
                <Image
                    source={require('../../assets/images/register_header.png')}
                    className="w-full h-full"
                    resizeMode="contain"
                />
            </View>

            {/* Bagian Konten Putih */}
            <View className="flex-1 items-center justify-center p-8">
                <Text className="text-3xl font-bold text-gray-800 text-center">
                    Create Your Profile Now!
                </Text>
                <Text className="text-base text-gray-500 text-center mt-4">
                    Create a profile to save your learning progress and keep learning for free!
                </Text>
            </View>

            {/* Bagian Tombol Bawah */}
            <View className="flex-row justify-between items-center p-8">
                <TouchableOpacity onPress={() => router.back()}>
                    <Text className="text-lg font-semibold text-gray-500">Back</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => router.push('/register-flow')}
                    className="bg-primary py-4 px-10 rounded-full"
                >
                    <Text className="text-white font-bold text-lg">Next</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}