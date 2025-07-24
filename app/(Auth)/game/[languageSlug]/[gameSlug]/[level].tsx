// Lokasi: app/game/[languageSlug]/[gameSlug]/[level].tsx
import React from 'react';
import { View, Text } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';

// Import semua komponen game lo
import TebakGambarQuiz from '@/components/games/TebakGambarQuiz';
import KartuKataQuiz from '@/components/games/KartuKataQuiz';
import SusunKalimatQuiz from '@/components/games/SusunKalimatQuiz';

export default function GameLevelPage() {
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

    if (gameSlug === 'susun_kalimat') {
        return <SusunKalimatQuiz params={params} />;
    }

    return (
        <View className="flex-1 justify-center items-center">
            <Text>Game "{gameSlug}" not found.</Text>
        </View>
    );
}