import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { Stack, useLocalSearchParams } from "expo-router";
import React, { useCallback, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

// Tipe untuk setiap pesan dalam chat
interface Message {
  role: "user" | "assistant";
  content: string;
}

// URL API dari server sementara Anda di Google Colab via ngrok
const API_URL = "https://0626211a5fd5.ngrok-free.app/chat";

export default function ChatPage() {
  const { session } = useAuth();
  const { languageSlug } = useLocalSearchParams<{ languageSlug: string }>();

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = useCallback(async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = { role: "user", content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    const currentInput = input; // Simpan input saat ini sebelum di-reset
    console.log("Sending message:", currentInput);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Catatan: Header Authorization tidak diperlukan karena ini API publik sementara Anda
        },
        // PERUBAHAN 1: Body disesuaikan dengan yang diharapkan server FastAPI
        body: JSON.stringify({
          prompt: currentInput,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API Error: ${response.status} - ${errorText}`);
      }

      const result = await response.json();

      // PERUBAHAN 2: Cara membaca balasan disesuaikan dengan output FastAPI
      const aiMessageContent = result.response.trim();
      const aiMessage: Message = {
        role: "assistant",
        content: aiMessageContent,
      };
      setMessages((prev) => [...prev, aiMessage]);

      saveChatToSupabase(userMessage, aiMessage);
    } catch (error) {
      console.error("AI Chat Error:", error);
      const errorMessage: Message = {
        role: "assistant",
        content:
          "Maaf, terjadi kesalahan saat menghubungi AI. Pastikan server Colab Anda masih berjalan.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  }, [input, messages, loading]);

  const saveChatToSupabase = async (userMsg: Message, aiMsg: Message) => {
    if (!session?.user) return;
    // Implementasi session_id unik bisa ditambahkan nanti
    const sessionId = "sesi_unik_sementara";

    await supabase.from("chat_history").insert([
      {
        user_id: session.user.id,
        session_id: sessionId,
        sender: "user",
        message_text: userMsg.content,
      },
      {
        user_id: session.user.id,
        session_id: sessionId,
        sender: "ai",
        message_text: aiMsg.content,
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ title: `Ngobrol Bahasa ${languageSlug}` }} />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
        keyboardVerticalOffset={100}
      >
        <FlatList
          data={messages}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item }) => (
            <View
              style={[
                styles.messageBubble,
                item.role === "user" ? styles.userBubble : styles.aiBubble,
              ]}
            >
              <Text
                style={item.role === "user" ? styles.userText : styles.aiText}
              >
                {item.content}
              </Text>
            </View>
          )}
          contentContainerStyle={styles.chatContainer}
          inverted // Menampilkan chat dari bawah ke atas
        />

        {loading && <ActivityIndicator style={{ marginVertical: 10 }} />}

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={input}
            onChangeText={setInput}
            placeholder="Ketik pesanmu..."
            editable={!loading}
          />
          <TouchableOpacity
            style={styles.sendButton}
            onPress={handleSend}
            disabled={loading}
          >
            <Text style={styles.sendButtonText}>Kirim</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F3F4F6" },
  chatContainer: { padding: 10, flexDirection: "column-reverse" }, // Dibalik untuk properti inverted
  messageBubble: {
    padding: 12,
    borderRadius: 18,
    maxWidth: "80%",
    marginBottom: 10,
  },
  userBubble: { backgroundColor: "#27AE60", alignSelf: "flex-end" },
  aiBubble: { backgroundColor: "#FFFFFF", alignSelf: "flex-start" },
  userText: { color: "white" },
  aiText: { color: "black" },
  inputContainer: {
    flexDirection: "row",
    padding: 10,
    borderTopWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "white",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: "#F9FAFB",
  },
  sendButton: {
    marginLeft: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#27AE60",
    borderRadius: 20,
    paddingHorizontal: 20,
  },
  sendButtonText: { color: "white", fontWeight: "bold" },
});
