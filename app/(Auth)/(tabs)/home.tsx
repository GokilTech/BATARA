import { Feather } from "@expo/vector-icons";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { Link, useFocusEffect } from "expo-router";
import React, { useCallback, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../../../context/AuthContext"; // <- Sesuaikan path
import { supabase } from "../../../lib/supabase"; // <- Sesuaikan path

// Tipe data untuk statistik bahasa dari Supabase
interface LanguageStats {
  id: number;
  name: string;
  slug: string;
  progress: number;
  highest_level: number;
}

// Komponen ProgressBar
const ProgressBar = ({ progress }: { progress: number }) => (
  <View style={styles.progressBarContainer}>
    <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
  </View>
);

// --- KOMPONEN UTAMA ---
export default function HomePage() {
  const { session } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [languages, setLanguages] = useState<LanguageStats[]>([]);
  const [loading, setLoading] = useState(true);

  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["68%", "90%"], []);

  // Gunakan useFocusEffect untuk refresh data setiap kali halaman ini ditampilkan
  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        if (!session?.user) return;

        try {
          // Ambil data profil pengguna
          const { data: profileData, error: profileError } = await supabase
            .from("profiles")
            .select("full_name")
            .eq("id", session.user.id)
            .single();
          if (profileError) throw profileError;
          setProfile(profileData);

          // Panggil fungsi RPC untuk mendapatkan statistik bahasa
          const { data: languagesData, error: rpcError } = await supabase.rpc(
            "get_user_bahasa_stats",
            { p_user_id: session.user.id }
          );
          if (rpcError) throw rpcError;
          setLanguages(languagesData || []);
        } catch (error) {
          console.error("Error fetching home data:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }, [session])
  );

  // Memisahkan bahasa yang sedang dipelajari dan yang lain
  const learningLanguages = languages.filter((lang) => lang.progress > 0);
  const otherLanguages = languages.filter((lang) => lang.progress === 0);

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#FFFFFF" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-primary">
      <View className="bg-primary pl-6">
        <View className="flex-row justify-between items-center">
          <View>
            <Text className="text-2xl font-bold text-white">
              Hi, {profile?.full_name || "Friend"}!
            </Text>
            <Text className="text-base text-white mt-1">
              What local language
            </Text>
            <Text className="text-base text-white mt-1">
              would you like to learn?
            </Text>
          </View>

          <Image
            source={require("../../../assets/images/header.png")}
            className="w-40 h-44 mr-[-10px]"
          />
        </View>
      </View>

      {/* 3. Ini komponen Bottom Sheet-nya */}
      <BottomSheet
        ref={bottomSheetRef}
        index={0}
        snapPoints={snapPoints}
        handleIndicatorStyle={{ backgroundColor: "#D1D5DB" }}
        backgroundStyle={{ borderTopLeftRadius: 30, borderTopRightRadius: 30 }} // Bikin sudut atasnya melengkung
      >
        {/* 4. PENTING: Konten scrollable HARUS dibungkus BottomSheetScrollView */}
        <BottomSheetScrollView showsVerticalScrollIndicator={false}>
          {/* 5. SEMUA KONTEN PUTIH LO PINDAHIN KE DALEM SINI */}
          <View className="px-6 pt-4">
            <View className="mx-4">
              <Text className="text-xl font-bold text-black mb-4 text-center">
                Language Being Learned
              </Text>
            </View>
            <FlatList
              data={learningLanguages}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <Link href={`/learning/${item.slug}`} asChild>
                  <TouchableOpacity style={styles.learningCard}>
                    <View>
                      <Text style={styles.learningCardTitle}>{item.name}</Text>
                      <Text style={styles.learningCardSubtitle}>
                        {item.highest_level} Level
                      </Text>
                    </View>
                    <View style={styles.playButton}>
                      <Feather name="play" size={20} color="#27AE60" />
                    </View>
                  </TouchableOpacity>
                </Link>
              )}
            />

            {/* Other Languages Section */}
            <View className="mt-6">
              <Text className="text-lg font-bold text-gray-800 mb-2">
                Other Languages
              </Text>
              {otherLanguages.map((lang) => (
                <Link key={lang.id} href={`/learning/${lang.slug}`} asChild>
                  <TouchableOpacity style={styles.otherCard}>
                    <View style={styles.otherCardHeader}>
                      <Text style={styles.otherCardTitle}>{lang.name}</Text>
                      <Text style={styles.otherCardProgressText}>
                        {lang.progress}%
                      </Text>
                    </View>
                    <ProgressBar progress={lang.progress} />
                  </TouchableOpacity>
                </Link>
              ))}
            </View>
            {/* Spacer biar ada ruang di bawah */}
            <View className="h-12" />
          </View>
        </BottomSheetScrollView>
      </BottomSheet>
    </SafeAreaView>
  );
}

// --- STYLES ---
const styles = StyleSheet.create({
  container: { flex: 1 },
  center: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#133E87",
  },
  headerContainer: { backgroundColor: "#27AE60", paddingLeft: 24 },
  headerTextContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: { fontSize: 24, fontWeight: "bold", color: "white" },
  headerSubtitle: { fontSize: 16, color: "white", marginTop: 4 },
  headerImage: { width: 160, height: 176, marginRight: -10 },
  sheetContainer: { paddingHorizontal: 24, paddingTop: 16 },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "black",
    marginBottom: 16,
    textAlign: "center",
  },
  sectionSubtitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 8,
  },
  learningCard: {
    padding: 16,
    borderRadius: 16,
    marginRight: 16,
    width: 192,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#27AE60",
  },
  learningCardTitle: { fontSize: 16, fontWeight: "bold", color: "white" },
  learningCardSubtitle: {
    fontSize: 12,
    fontWeight: "600",
    color: "white",
    marginTop: 4,
  },
  playButton: { backgroundColor: "white", padding: 16, borderRadius: 999 },
  otherCard: {
    backgroundColor: "#F9FAFB",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  otherCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  otherCardTitle: { fontSize: 16, fontWeight: "600", color: "#374151" },
  otherCardProgressText: { fontSize: 14, fontWeight: "bold", color: "#27AE60" },
  progressBarContainer: {
    width: "100%",
    backgroundColor: "#E5E7EB",
    borderRadius: 999,
    height: 10,
    marginTop: 8,
  },
  progressBarFill: {
    backgroundColor: "#27AE60",
    height: 10,
    borderRadius: 999,
  },
});
