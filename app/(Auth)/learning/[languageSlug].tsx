import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { Feather } from "@expo/vector-icons";
import { Href, Link, Stack, useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";

import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from "react-native";
interface LessonModule {
  lesson_id: string;
  lesson_title: string;
  lesson_level: number;
  lesson_image_url: string;
  game_id: number;
  game_name: string;
  game_slug: string;
  progress: number;
}
interface BahasaInfo {
  name: string;
  avatar_url: string | null
}

// --- Komponen Bantu ---
const ProgressBar = ({ progress }: { progress: number }) => (
  <View className="w-full bg-gray-200 rounded-full h-2 mt-2">
    <View className="bg-blue-400 h-2 rounded-full" style={{ width: `${progress}%` }} />
  </View>
);

export default function LearningPage() {
  const { languageSlug } = useLocalSearchParams<{ languageSlug: string }>();
  const { session } = useAuth();
  const [bahasaInfo, setBahasaInfo] = useState<BahasaInfo | null>(null);
  const [lessonModules, setLessonModules] = useState<LessonModule[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        if (!session?.user || !languageSlug) return;
        setLoading(true);
        try {
          // Ambil info bahasa (tetap sama)
          const { data: bahasaData, error: bahasaError } = await supabase
            .from("bahasa").select("name, avatar_url").eq("slug", languageSlug).single();
          if (bahasaError) throw bahasaError;
          setBahasaInfo(bahasaData);

          // PANGGIL FUNGSI RPC YANG BARU
          const { data: modulesData, error: rpcError } = await supabase.rpc(
            "get_lessons_with_progress",
            { p_user_id: session.user.id, p_bahasa_slug: languageSlug }
          );
          if (rpcError) throw rpcError;
          setLessonModules(modulesData || []);

        } catch (error) {
          console.error("Error fetching learning data:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }, [languageSlug, session])
  );

  if (loading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#3b82f6" />
      </SafeAreaView>
    );
  }

  if (!bahasaInfo) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-white">
        <Stack.Screen options={{ title: "Not Found" }} />
        <Text className="text-xl text-gray-500">Language not found!</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <Stack.Screen options={{ headerShown: false }} />

      {/* Header Kustom (Sesuai Desain Baru) */}
      <View className="flex-row items-center justify-between p-4">
          <TouchableOpacity onPress={() => router.back()} className="bg-white p-2 rounded-full shadow-sm">
              <Feather name="arrow-left" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity className="bg-white p-2 rounded-full shadow-sm">
              <Feather name="menu" size={24} color="black" />
          </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
        {/* Gambar & Judul Bahasa */}
        <View className="items-center px-6">
          <Image
            source={ bahasaInfo.avatar_url ? { uri: bahasaInfo.avatar_url } : require("@/assets/images/avatar.png") }
            className="w-48 h-48"
            resizeMode="contain"
          />
          <Text className="text-3xl font-bold text-gray-800 mt-4 text-center">Learn {bahasaInfo.name}</Text>
        </View>

        {/* Daftar Lesson/Game (Sekarang dari data baru) */}
        <View className="px-6 mt-8 space-y-4 gap-4 shadow-sm">
          {lessonModules.map((module) => {
              const hrefConfig: Href = {
                pathname: '/game/[languageSlug]/[gameSlug]/[level]',
                params: { languageSlug, gameSlug: module.game_slug, level: module.lesson_level }
              };

              return (
                <Link key={module.lesson_id} href={hrefConfig} asChild>
                  <TouchableOpacity className="bg-white rounded-2xl shadow-sm overflow-hidden">
                    <View className="p-4 flex-row justify-between items-center">
                      <View className="flex-1 pr-4">
                        <Text className="text-lg font-bold text-gray-800">{module.game_name}</Text>
                        <Text className="text-sm text-gray-500 mt-1">LEVEL {module.lesson_level}</Text>
                        <ProgressBar progress={module.progress} />
                        <View className="flex-row items-center bg-blue-100/60 self-start px-4 py-2 rounded-full mt-4">
                            <Text className="text-sm font-bold text-blue-500">Play Now</Text>
                            <Feather name="play-circle" size={16} color="#3b82f6" className="ml-2" />
                        </View>
                      </View>
                      <Image
                        source={ module.lesson_image_url ? { uri: module.lesson_image_url } : require("@/assets/images/avatar.png") }
                        className="w-24 h-24 rounded-lg"
                      />
                    </View>
                  </TouchableOpacity>
                </Link>
              );
            })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}