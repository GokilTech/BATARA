// Lokasi: app/game/[languageSlug]/[gameSlug]/[level].tsx
import { Stack, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { Text, View } from 'react-native';

// Import semua komponen game lo
import KartuKataQuiz from '@/components/games/KartuKataQuiz';
import SusunKalimatQuiz from '@/components/games/SusunKalimatQuiz';
import TebakGambarQuiz from '@/components/games/TebakGambarQuiz';

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
            <Text>Game {gameSlug} not found.</Text>
        </View>
    );
}