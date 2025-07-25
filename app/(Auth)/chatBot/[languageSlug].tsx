import { useAuth } from "@/context/AuthContext";
import { Stack, useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// --- TIPE DATA ---
interface StoryTurn {
  story: string;
  question: string;
  choices: { a: string; b: string; c: string };
}

// --- PENGATURAN OPENROUTER ---
const API_URL = "https://openrouter.ai/api/v1/chat/completions";
const OPENROUTER_API_KEY = process.env.EXPO_PUBLIC_OPENROUTER_API_KEY;
// ... (variabel URL & Nama Situs Anda)

// --- CONTOH PROFIL KARAKTER (Ini akan datang dari halaman setup) ---
const characterProfile = {
  name: "Budi",
  age: 28,
  profession: "Software Engineer",
  province: "Jawa Tengah",
};

export default function StoryGamePage() {
  const { languageSlug } = useLocalSearchParams<{ languageSlug: string }>();
  const { session } = useAuth();

  const [currentTurn, setCurrentTurn] = useState<StoryTurn | null>(null);
  const [storyHistory, setStoryHistory] = useState<string[]>([]); // Untuk menyimpan pilihan
  const [loading, setLoading] = useState(true);

  // Fungsi untuk memanggil AI
  const getNextStoryTurn = useCallback(
    async (lastChoice: string | null) => {
      setLoading(true);
      try {
        const lastChoiceText = lastChoice
          ? `Pilihan Terakhir Pengguna: "${lastChoice}"`
          : "Ini adalah awal cerita.";

        const prompt = `Anda adalah seorang penulis cerita interaktif untuk game belajar Bahasa ${languageSlug}. 
Tugas Anda adalah melanjutkan cerita berdasarkan profil karakter dan pilihan terakhirnya.
Cerita harus selalu mengandung unsur budaya dari provinsi ${characterProfile.province}.

Profil Karakter:
- Nama: ${characterProfile.name}
- Usia: ${characterProfile.age}
- Pekerjaan: ${characterProfile.profession}
- Provinsi: ${characterProfile.province}

${lastChoiceText}

Lanjutkan cerita dalam satu paragraf singkat. Setelah itu, buatlah sebuah pertanyaan pilihan ganda tentang cerita tersebut. Pertanyaan dan 3 pilihan jawaban (A, B, C) HARUS dalam Bahasa ${languageSlug}.

RESPONS ANDA HARUS HANYA BERUPA OBJEK JSON, TANPA TEKS LAIN. Gunakan struktur ini:
{
  "story": "Paragraf cerita dalam Bahasa Indonesia...",
  "question": "Pertanyaan dalam Bahasa ${languageSlug}...",
  "choices": {
    "a": "Pilihan A dalam Bahasa ${languageSlug}",
    "b": "Pilihan B dalam Bahasa ${languageSlug}",
    "c": "Pilihan C dalam Bahasa ${languageSlug}"
  }
}`;

        const response = await fetch(API_URL, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${OPENROUTER_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "deepseek/deepseek-r1:free",
            response_format: { type: "json_object" }, // Memaksa output JSON
            messages: [{ role: "user", content: prompt }],
          }),
        });

        if (!response.ok) throw new Error(await response.text());

        const result = await response.json();
        const aiResponse: StoryTurn = JSON.parse(
          result.choices[0].message.content
        );
        setCurrentTurn(aiResponse);
      } catch (error) {
        console.error("Story Game Error:", error);
        // Tampilkan pesan error di UI
      } finally {
        setLoading(false);
      }
    },
    [languageSlug]
  );

  // Memulai game saat halaman pertama kali dimuat
  useEffect(() => {
    getNextStoryTurn(null); // Panggilan pertama, tidak ada pilihan sebelumnya
  }, [getNextStoryTurn]);

  const handleChoice = (choice: string) => {
    if (!currentTurn) return;
    // Simpan interaksi ke Supabase (disarankan)
    // ... supabase.from('story_interactions').insert(...) ...

    // Lanjutkan cerita
    setStoryHistory((prev) => [...prev, choice]);
    getNextStoryTurn(choice);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ title: `Cerita ${characterProfile.name}` }} />

      {loading && !currentTurn ? (
        <ActivityIndicator size="large" style={styles.center} />
      ) : (
        currentTurn && (
          <View style={styles.content}>
            <Text style={styles.storyText}>{currentTurn.story}</Text>
            <View style={styles.divider} />
            <Text style={styles.questionText}>{currentTurn.question}</Text>

            <View style={styles.choicesContainer}>
              {Object.values(currentTurn.choices).map((choice, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.choiceButton,
                    loading ? { opacity: 0.5 } : null,
                  ]}
                  onPress={() => handleChoice(choice)}
                  disabled={loading}
                >
                  <Text style={styles.choiceText}>{choice}</Text>
                </TouchableOpacity>
              ))}
            </View>
            {loading && <ActivityIndicator style={{ marginTop: 20 }} />}
          </View>
        )
      )}
    </SafeAreaView>
  );
}

// --- STYLES ---
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F3F4F6" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  content: { padding: 20, flex: 1 },
  storyText: { fontSize: 18, lineHeight: 28, color: "#1F2937" },
  divider: { height: 1, backgroundColor: "#E5E7EB", marginVertical: 20 },
  questionText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
    textAlign: "center",
  },
  choicesContainer: { marginTop: 20 },
  choiceButton: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#D1D5DB",
  },
  choiceText: { fontSize: 16, textAlign: "center", color: "#111827" },
});