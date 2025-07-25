import { useAuth } from "@/context/AuthContext";
import { Stack, useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

// --- TIPE DATA ---
interface StoryTurn {
  story: string;
  question: string;
  choices: { a: string; b: string; c: string };
  answerKey: "a" | "b" | "c";
}

type Choice = {
  text: string;
  isCorrect: boolean;
  explanation?: string; // Penjelasan opsional jika jawaban salah
  nextSceneId: string; // ID scene berikutnya
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

  const [selectedChoice, setSelectedChoice] = useState<Choice | null>(null);
  const [showModal, setShowModal] = useState(false);


  // Fungsi untuk memanggil AI
  const getNextStoryTurn = useCallback(
    async (lastChoice: string | null, previousFeedback: string = "") => {
      setLoading(true);
      try {
        const lastChoiceText = lastChoice
          ? `Pilihan Terakhir Pengguna: "${lastChoice}"`
          : "Ini adalah awal cerita.";

        const prompt = `
${previousFeedback ? `Catatan: ${previousFeedback}` : ""}
${lastChoiceText}

Anda adalah seorang penulis cerita interaktif untuk game belajar Bahasa ${languageSlug}. 
Tugas Anda adalah melanjutkan cerita berdasarkan profil karakter dan pilihan terakhirnya.
Cerita harus selalu mengandung unsur budaya dari provinsi ${characterProfile.province}.

Profil Karakter:
- Nama: ${characterProfile.name}
- Usia: ${characterProfile.age}
- Pekerjaan: ${characterProfile.profession}
- Provinsi: ${characterProfile.province}

Lanjutkan cerita dalam satu paragraf singkat. Setelah itu, buatlah sebuah pertanyaan pilihan ganda tentang cerita tersebut. Pertanyaan dan 3 pilihan jawaban (A, B, C) HARUS dalam Bahasa ${languageSlug}. Sertakan juga jawaban yang benar dalam format: "answerKey": "a"/"b"/"c".

RESPONS ANDA HARUS HANYA BERUPA OBJEK JSON, TANPA TEKS LAIN. Gunakan struktur ini:
{
  "story": "Paragraf cerita dalam Bahasa Indonesia...",
  "question": "Pertanyaan dalam Bahasa ${languageSlug}...",
  "choices": {
    "a": "Pilihan A dalam Bahasa ${languageSlug}",
    "b": "Pilihan B dalam Bahasa ${languageSlug}",
    "c": "Pilihan C dalam Bahasa ${languageSlug}"
  },
  "answerKey": "a"
}`;

        const response = await fetch(API_URL, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${OPENROUTER_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "deepseek/deepseek-r1:free",
            response_format: { type: "json_object" },
            messages: [{ role: "user", content: prompt }],
          }),
        });

        if (!response.ok) throw new Error(await response.text());

        const result = await response.json();
        const content = result.choices[0]?.message?.content;
        try {
          const aiResponse: StoryTurn = JSON.parse(content);
          if (
            !aiResponse.story ||
            !aiResponse.question ||
            !aiResponse.choices ||
            !aiResponse.answerKey
          )
            throw new Error("Missing fields");
          setCurrentTurn(aiResponse);
        } catch (err) {
          console.error("Invalid AI response:", content);
        }
      } catch (error) {
        console.error("Story Game Error:", error);
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

  const handleChoice = (choice: Choice) => {
    console.log("User chose:", choice.text);
    setSelectedChoice(choice);
    setShowModal(true); // Tampilkan feedback modal

    const feedback = choice.isCorrect
      ? "Jawaban pengguna sebelumnya benar."
      : `Jawaban sebelumnya salah. Jawaban yang benar adalah: "${currentTurn?.choices[currentTurn.answerKey]}"`;

    setStoryHistory((prev) => [...prev, choice.text]);

    // Simpan feedback untuk prompt selanjutnya
    setTimeout(() => {
      getNextStoryTurn(choice.text, feedback);
    }, 1500); // Delay agar UX lebih smooth
  };
  

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ title: `Cerita ${characterProfile.name}` }} />

      {loading && !currentTurn ? (
        <ActivityIndicator size="large" style={styles.center} />
      ) : (
        currentTurn && (
          <ScrollView style={styles.content}>
            <Text style={styles.storyText}>{currentTurn.story}</Text>
            <View style={styles.divider} />
            <Text style={styles.questionText}>{currentTurn.question}</Text>

            <View style={styles.choicesContainer}>
              {Object.entries(currentTurn.choices).map(([key, text]) => {
                const isCorrect = key === currentTurn.answerKey;
                const explanation = isCorrect
                  ? "Bagus! Jawaban kamu benar."
                  : `Kurang tepat. Jawaban yang benar adalah: "${currentTurn.choices[currentTurn.answerKey]}"`;

                const choiceObj: Choice = {
                  text,
                  isCorrect,
                  explanation,
                  nextSceneId: "ai", // Semua ke AI
                };

                return (
                  <TouchableOpacity
                    key={key}
                    style={[styles.choiceButton, loading && { opacity: 0.5 }]}
                    onPress={() => handleChoice(choiceObj)}
                    disabled={loading}
                  >
                    <Text style={styles.choiceText}>{text}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {loading && <ActivityIndicator style={{ marginTop: 20 }} />}
          </ScrollView>
        )
      )}
      <Modal visible={showModal} transparent animationType="slide">
        <View className="bg-white m-8 p-4 rounded-xl shadow-lg">
          <Text className="text-lg font-bold mb-2">
            {selectedChoice?.isCorrect ? "Jawaban Benar!" : "Jawaban Salah!"}
          </Text>
          <Text className="mb-4">{selectedChoice?.explanation}</Text>
          <TouchableOpacity
            style={[styles.choiceButton, loading && { opacity: 0.5 }]}
            onPress={() => setShowModal(false)}
            disabled={loading}
          >
            <Text style={styles.choiceText}>Lanjut Cerita</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// --- STYLES ---
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#133E87" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  content: { padding: 20, flex: 1 },
  storyText: { fontSize: 18, lineHeight: 28, color: "#ffffff" },
  divider: { height: 1, backgroundColor: "#E5E7EB", marginVertical: 20 },
  questionText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
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