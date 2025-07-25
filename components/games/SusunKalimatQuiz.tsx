import { View, Text, SafeAreaView, TouchableOpacity, Image, ActivityIndicator, Alert } from "react-native";
import React, { useState, useEffect } from "react";
import { Stack, useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { supabase } from "@/lib/supabase"; // Pastikan path ini benar

// --- TIPE DATA ---
interface SusunKalimatContent {
    id: number;
    sentence: string;
    image: string; // Ini akan jadi URL dari Supabase Storage
    correctAnswer: string;
    wordBank: string[];
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
export default function SusunKalimatQuiz({ params }: QuizPageProps) {
    const router = useRouter();
    const { languageSlug, gameSlug, level } = params;

    // --- STATE MANAGEMENT ---
    const [questions, setQuestions] = useState<SusunKalimatContent[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answerSlots, setAnswerSlots] = useState<string[]>([]);
    const [wordBank, setWordBank] = useState<string[]>([]);
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

    // --- MENYIAPKAN SOAL (ACAK KATA, DLL) ---
    useEffect(() => {
        if (questions.length > 0 && questions[currentQuestionIndex]) {
            const currentQuestion = questions[currentQuestionIndex];
            const shuffled = [...currentQuestion.wordBank].sort(() => Math.random() - 0.5);
            setWordBank(shuffled);
            setAnswerSlots([]);
            setIsAnswerChecked(false);
            setIsCorrect(false);
        }
    }, [currentQuestionIndex, questions]);

    // --- FUNCTIONS ---
    const handleSelectWord = (word: string) => {
        if (isAnswerChecked) return;
        setWordBank(wordBank.filter(item => item !== word));
        setAnswerSlots([...answerSlots, word]);
    };

    const handleDeselectWord = (word: string, index: number) => {
        if (isAnswerChecked) return;
        setAnswerSlots(answerSlots.filter((_, i) => i !== index));
        setWordBank([...wordBank, word]);
    };

    const handleCheckAnswer = () => {
        if (!questions[currentQuestionIndex]) return;
        const userAnswer = answerSlots.join(" ");
        setIsCorrect(userAnswer === questions[currentQuestionIndex].correctAnswer);
        setIsAnswerChecked(true);
    };

    const handleNextQuestion = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
            Alert.alert("Quiz Completed!, You're amazing, all questions have been answered!");
            router.back();
        }
    };

    // --- TAMPILAN LOADING & EMPTY STATE ---
    if (loading) {
        return <SafeAreaView className="flex-1 justify-center items-center"><ActivityIndicator size="large" color="#3b82f6" /></SafeAreaView>;
    }
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
                    <Text className="text-2xl font-bold text-gray-800 text-center">What's the meaning of this sentence?</Text>
                    <View className="flex-row items-center bg-gray-100 p-3 rounded-2xl my-6">
                        <Image 
                            source={currentQuestion.image ? { uri: currentQuestion.image } : require('@/assets/images/avatar.png')} 
                            className="w-12 h-12 rounded-full" 
                        />
                        <Text className="ml-3 text-lg text-gray-700 flex-1">{currentQuestion.sentence}</Text>
                    </View>
                </View>

                <View className="border-b-2 border-gray-300 pb-4 min-h-[80px]">
                    <View className="flex-row flex-wrap gap-2">
                        {answerSlots.map((word, index) => (
                            <TouchableOpacity key={index} onPress={() => handleDeselectWord(word, index)}>
                                <Text className="text-lg bg-blue-100 border border-blue-300 p-2 rounded-lg">{word}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                <View className="pt-4 items-center min-h-[120px]">
                    <View className="flex-row flex-wrap gap-2 justify-center">
                        {wordBank.map((word, index) => (
                            <TouchableOpacity key={index} onPress={() => handleSelectWord(word)}>
                                <Text className="text-lg bg-white shadow-md p-2 rounded-lg">{word}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            </View>

            {isAnswerChecked ? (
                 <View className={`p-6 rounded-t-2xl ${isCorrect ? 'bg-green-100' : 'bg-red-100'}`}>
                    <Text className={`text-2xl font-bold ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                        {isCorrect ? "That's Right!" : "Ups.. That not quite right"}
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
                        disabled={answerSlots.length === 0}
                        className={`py-4 rounded-full ${answerSlots.length === 0 ? 'bg-gray-300' : 'bg-[#003B46]'}`}
                    >
                        <Text className="text-white text-center font-bold text-lg">Check</Text>
                    </TouchableOpacity>
                </View>
            )}
        </SafeAreaView>
    );
}