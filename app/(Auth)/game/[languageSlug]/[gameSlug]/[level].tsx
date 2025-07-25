import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect } from "react";
import { Text, View } from "react-native";

// Import semua komponen game
import KartuKataQuiz from "@/components/games/KartuKataQuiz";
import SusunKalimatQuiz from "@/components/games/SusunKalimatQuiz";
import TebakGambarQuiz from "@/components/games/TebakGambarQuiz";

export default function GameLevelPage() {
  const params = useLocalSearchParams<{
    languageSlug: string;
    gameSlug: string;
    level: string;
  }>();
  const { gameSlug, languageSlug } = params;
  const router = useRouter();

  // Redirect jika game adalah ngobrol_ai
  useEffect(() => {
    if (gameSlug === "ngobrol_ai" && languageSlug) {
      router.replace({
        pathname: "/chatBot/[languageSlug]",
        params: { languageSlug },
      });
    }
  }, [gameSlug, languageSlug]);

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      {gameSlug === "tebak_gambar" && <TebakGambarQuiz params={params} />}
      {gameSlug === "kartu_kata" && <KartuKataQuiz params={params} />}
      {gameSlug === "susun_kalimat" && <SusunKalimatQuiz params={params} />}

      {/* Jika tidak ada yang cocok dan belum redirect */}
      {gameSlug !== "tebak_gambar" &&
        gameSlug !== "kartu_kata" &&
        gameSlug !== "susun_kalimat" &&
        gameSlug !== "ngobrol_ai" && (
          <View className="flex-1 justify-center items-center">
            <Text>Game {gameSlug} not found.</Text>
          </View>
        )}
    </>
  );
}