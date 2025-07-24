// Lokasi: app/game/[languageSlug]/[gameSlug]/[level].tsx
import React from 'react';
import { View, Text } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';

// Import semua komponen game lo
import TebakGambarQuiz from '@/components/games/TebakGambarQuiz';
import KartuKataQuiz from '@/components/games/KartuKataQuiz';

export default function GameLevelPage() {
    // Kita ambil SEMUA params yang relevan dari URL
    const params = useLocalSearchParams<{ 
        languageSlug: string;
        gameSlug: string;
        level: string; 
    }>();
    
    const { gameSlug } = params;

    <Stack.Screen options={{ headerShown: false }} />

    if (gameSlug === 'tebak_gambar') {
        return <TebakGambarQuiz params={params} />;
    }
    
    if (gameSlug === 'kartu_kata') {
        return <KartuKataQuiz params={params} />;
    }
    return (
        <View className="flex-1 justify-center items-center">
            <Text>Game "{gameSlug}" not found.</Text>
        </View>
    );
}