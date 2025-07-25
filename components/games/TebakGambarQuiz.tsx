import { View, Text, SafeAreaView, TouchableOpacity, Image, ActivityIndicator, Alert } from "react-native";
import React, { useState, useEffect } from "react";
import { Stack, useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { supabase } from "@/lib/supabase"; // Pastikan path ini benar

// --- TIPE DATA (Sesuai isi JSONB di tabel 'questions') ---
interface TebakGambarContent {
    id: number;
    questionText: string;
    imageUrl: string; // URL gambar dari Supabase Storage
    options: string[];
    correctAnswer: string;
}

type QuizPageProps = {
    params: {
        languageSlug: string;
        gameSlug: string;
        level: string;
    }
}

// --- KOMPONEN BANTU: Progress Bar ---
const SegmentedProgressBar = ({ current, total }: { current: number; total: number }) => {
    return (
        <View className="flex-row flex-1 space-x-1 mx-4">
            {[...Array(total)].map((_, index) => (
                <View
                    key={index}
                    className={`flex-1 h-2 rounded-full ${index < current ? 'bg-blue-500' : 'bg-gray-200'}`}
                />
            ))}
        </View>
    );
};

// --- KOMPONEN UTAMA ---
export default function TebakGambarQuiz({ params }: QuizPageProps) {
    const router = useRouter();
    const { languageSlug, gameSlug, level } = params;

    // --- STATE MANAGEMENT ---
    const [questions, setQuestions] = useState<TebakGambarContent[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [isAnswerChecked, setIsAnswerChecked] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);

    // --- FETCH DATA DARI SUPABASE ---
    useEffect(() => {
        const fetchQuestions = async () => {
            setLoading(true);
            try {
                const { data, error } = await supabase.rpc('get_questions_for_lesson', {
                    p_language_slug: languageSlug,
                    p_game_slug: gameSlug,
                    p_level: Number(level)
                });


                if (error) throw error;
                setQuestions(data || []);
            } catch (err) {
                console.error("Error fetching questions:", err);
                setQuestions([]);
            } finally {
                setLoading(false);
            }
        };

        fetchQuestions();
    }, [languageSlug, gameSlug, level]);

    // --- FUNCTIONS ---
    const handleSelectAnswer = (option: string) => {
        if (!isAnswerChecked) {
            setSelectedAnswer(option);
        }
    };

    const handleCheckAnswer = () => {
        if (!selectedAnswer || !questions[currentQuestionIndex]) return;
        const correct = selectedAnswer === questions[currentQuestionIndex].correctAnswer;
        setIsCorrect(correct);
        setIsAnswerChecked(true);
    };

    const handleNextQuestion = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setSelectedAnswer(null);
            setIsAnswerChecked(false);
            setIsCorrect(false);
        } else {
            Alert.alert("Quiz Selesai!", "Kamu hebat, semua soal sudah dijawab!");
            router.back();
        }
    };

    // Tampilan Loading
    if (loading) {
        return <SafeAreaView className="flex-1 justify-center items-center"><ActivityIndicator size="large" color="#3b82f6" /></SafeAreaView>;
    }

    // Tampilan Jika Tidak Ada Soal
    if (questions.length === 0) {
        return (
            <SafeAreaView className="flex-1 justify-center items-center p-6">
                <Text className="text-xl text-gray-500 text-center">Soal tidak ditemukan untuk level ini.</Text>
                <TouchableOpacity onPress={() => router.back()} className="mt-4 bg-primary px-6 py-3 rounded-full">
                    <Text className="text-white font-bold">Kembali</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

    const currentQuestion = questions[currentQuestionIndex];
    const totalQuestions = questions.length;

    if (!currentQuestion) {
        return <SafeAreaView className="flex-1 justify-center items-center"><ActivityIndicator size="large" color="#3b82f6" /></SafeAreaView>;
    }

    return (
        <SafeAreaView className="flex-1 bg-white">
            <Stack.Screen options={{ headerShown: false }} />

            <View className="p-4 flex-row items-center">
                <TouchableOpacity onPress={() => router.back()} className="p-2">
                    <Feather name="arrow-left" size={24} color="gray" />
                </TouchableOpacity>
                <SegmentedProgressBar current={currentQuestionIndex + 1} total={totalQuestions} />
            </View>

            <View className="flex-1 p-6 justify-between">
                <View className="items-center">
                    <Text className="text-2xl font-bold text-gray-800 text-center">{currentQuestion.questionText}</Text>
                    <Image
                        source={currentQuestion.imageUrl ? { uri: currentQuestion.imageUrl } : require('@/assets/images/avatar.png')} 
                        className="w-40 h-40 my-8"
                        resizeMode="contain"
                    />
                </View>

                <View className="space-y-4">
                    {currentQuestion.options.map((option) => (
                        <TouchableOpacity
                            key={option}
                            onPress={() => handleSelectAnswer(option)}
                            disabled={isAnswerChecked}
                            className={`p-4 rounded-2xl border-b-4 
                                ${isAnswerChecked
                                    ? option === currentQuestion.correctAnswer
                                        ? 'bg-green-400 border-green-600'
                                        : option === selectedAnswer
                                            ? 'bg-red-400 border-red-600'
                                            : 'bg-blue-400 border-blue-600'
                                    : selectedAnswer === option
                                        ? 'bg-[#003B46] border-[#001f25]'
                                        : 'bg-blue-400 border-blue-600'
                                }
                            `}
                        >
                            <Text className="text-xl font-bold text-white text-center">{option}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            {isAnswerChecked ? (
                <View className={`p-6 rounded-t-2xl ${isCorrect ? 'bg-green-100' : 'bg-red-100'}`}>
                    <Text className={`text-2xl font-bold ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                        {isCorrect ? "Amazing!" : "Ups.. that's wrong"}
                    </Text>
                    <Text className="text-base text-gray-700 mt-1">Answer : {currentQuestion.correctAnswer}</Text>
                    <TouchableOpacity
                        onPress={handleNextQuestion}
                        className={`py-4 rounded-full mt-4 ${isCorrect ? 'bg-green-500' : 'bg-red-500'}`}
                    >
                        <Text className="text-white text-center font-bold text-lg">Next Question</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <View className="p-6">
                    <TouchableOpacity
                        onPress={handleCheckAnswer}
                        disabled={!selectedAnswer}
                        className={`py-4 rounded-full ${!selectedAnswer ? 'bg-gray-300' : 'bg-[#003B46]'}`}
                    >
                        <Text className="text-white text-center font-bold text-lg">Check Answer</Text>
                    </TouchableOpacity>
                </View>
            )}
        </SafeAreaView>
    );
}