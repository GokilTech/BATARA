import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { Feather } from "@expo/vector-icons";
import { Link, Stack, useFocusEffect, useLocalSearchParams } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// --- TIPE DATA DARI RPC ---
interface GameModule {
  game_id: number;
  game_name: string;
  game_slug: string;
  game_icon: string;
  total_lessons: number;
  lessons_completed: number;
  progress: number;
  highest_level_completed: number;
}

interface BahasaInfo {
  name: string;
  image_url: string | null;
}

const ProgressBar = ({ progress }: { progress: number }) => (
  <View style={styles.progressBarContainer}>
    <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
  </View>
);

export default function LearningPage() {
  const { languageSlug } = useLocalSearchParams<{ languageSlug: string }>();
  const { session } = useAuth();

  const [bahasaInfo, setBahasaInfo] = useState<BahasaInfo | null>(null);
  const [gameModules, setGameModules] = useState<GameModule[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        if (!session?.user || !languageSlug) return;

        // <-- LOG TAMBAHAN 1 -->
        console.log(`[DEBUG] Memulai fetch data untuk bahasa: ${languageSlug}`);

        setLoading(true);
        try {
          const { data: bahasaData, error: bahasaError } = await supabase
            .from("bahasa")
            .select("name, image_url")
            .eq("slug", languageSlug)
            .single();
          if (bahasaError) throw bahasaError;
          setBahasaInfo(bahasaData);

          console.log("[DEBUG] Info bahasa yang didapat:", bahasaData);

          // <-- LOG TAMBAHAN 2 -->
          console.log("[DEBUG] Info bahasa yang didapat:", bahasaData);

          const { data: modulesData, error: rpcError } = await supabase.rpc(
            "get_user_game_stats_for_bahasa",
            { p_user_id: session.user.id, p_bahasa_slug: languageSlug }
          );
          if (rpcError) throw rpcError;

          // <-- LOG TAMBAHAN 3 (PALING PENTING) -->
          console.log("[DEBUG] Modul game yang didapat dari RPC:", modulesData);

          setGameModules(modulesData || []);
        } catch (error) {
          // <-- LOG TAMBAHAN 4 -->
          console.error("[DEBUG] Terjadi error saat fetch data:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }, [languageSlug, session])
  );

  // ... sisa kode tidak berubah ...

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#27AE60" />
      </SafeAreaView>
    );
  }

  if (!bahasaInfo) {
    return (
      <SafeAreaView style={[styles.container, styles.center]}>
        <Stack.Screen options={{ title: "Not Found" }} />
        <Text style={styles.notFoundText}>Language not found!</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          title: `Learn ${bahasaInfo.name}`,
          headerShadowVisible: false,
        }}
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Image
            source={
              bahasaInfo.image_url
                ? { uri: bahasaInfo.image_url }
                : require("@/assets/images/sundanese_people.png") // Ganti dengan gambar default jika tidak ada
            }
            style={styles.headerImage}
            resizeMode="contain"
          />
          <Text style={styles.headerTitle}>Learn {bahasaInfo.name}</Text>
        </View>

        <View style={styles.moduleList}>
          {gameModules.length > 0 ? (
            gameModules.map((module) => {
              const nextLevel = module.highest_level_completed + 1;
              const isCompleted =
                nextLevel > module.total_lessons && module.total_lessons > 0;

              return (
                <Link
                  key={module.game_id}
                  // ✅ GUNAKAN PENDEKATAN OBJEK INI
                  href={{
                    pathname: "/game/ngobrol_ai/[languageSlug]/[level]",
                    params: {
                      gameSlug: module.game_slug,
                      languageSlug: languageSlug,
                      level: nextLevel,
                    },
                  }}
                  asChild
                >
                  <TouchableOpacity style={styles.card}>
                    <View style={styles.iconContainer}>
                      <Feather
                        name={module.game_icon as any}
                        size={24}
                        color={"#27AE60"}
                      />
                    </View>
                    <View style={styles.cardContent}>
                      <Text style={styles.cardTitle}>{module.game_name}</Text>
                      <Text style={styles.cardSubtitle}>
                        {isCompleted
                          ? "All lessons completed!"
                          : `Lesson ${module.lessons_completed} / ${module.total_lessons}`}
                      </Text>
                      <ProgressBar progress={module.progress} />
                    </View>
                  </TouchableOpacity>
                </Link>
              );
            })
          ) : (
            <Text style={styles.noGamesText}>
              Belum ada game yang tersedia untuk bahasa ini.
            </Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// --- STYLES ---
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white" },
  center: { justifyContent: "center", alignItems: "center" },
  notFoundText: { fontSize: 20, color: "#6B7280" },
  header: { alignItems: "center", marginTop: 16, marginBottom: 24 },
  headerImage: { width: 150, height: 150 },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 16,
    color: "#111827",
  },
  moduleList: { paddingHorizontal: 24 },
  card: {
    backgroundColor: "#F9FAFB",
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: { backgroundColor: "#E0F2F1", padding: 12, borderRadius: 12 },
  cardContent: { flex: 1, marginLeft: 16 },
  cardTitle: { fontSize: 18, fontWeight: "600", color: "#1F2937" },
  cardSubtitle: { fontSize: 14, color: "#6B7280", marginTop: 4 },
  progressBarContainer: {
    width: "100%",
    backgroundColor: "#E5E7EB",
    borderRadius: 999,
    height: 8,
    marginTop: 8,
  },
  progressBarFill: { backgroundColor: "#27AE60", height: 8, borderRadius: 999 },
  noGamesText: {
    textAlign: "center",
    color: "#6B7280",
    marginTop: 20,
    fontSize: 16,
  },
});
