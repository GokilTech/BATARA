// Lokasi: components/games/SusunKalimatQuiz.tsx
import { View, Text, SafeAreaView, TouchableOpacity, Image } from "react-native";
import React, { useState, useEffect } from "react";
import { Stack, useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";

type ProgressBarProps = {
    current: number;
    total: number;
};

type QuizPageProps = {
    params: {
        languageSlug: string;
        gameSlug: string;
        level: string;
    }
}

// --- DUMMY DATA ---
const quizData = {
    totalQuestions: 5,
    questions: [
        {
            id: 1,
            sentence: "Abdi Elis, nami anjeun saha?",
            image: require('@/assets/images/avatar.png'),
            correctAnswer: "I Am Elis, What's Your Name ?",
            wordBank: ["Your", "Elis,", "I", "Name", "Am", "What's", "?"],
        },
    ],
};

const SegmentedProgressBar = ({ current, total }: ProgressBarProps) => {
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

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const currentQuestion = quizData.questions[currentQuestionIndex];

    // --- STATE MANAGEMENT untuk Game ---
    // State untuk kata-kata di slot jawaban
    const [answerSlots, setAnswerSlots] = useState<string[]>([]);
    // State untuk kata-kata di bank kata
    const [wordBank, setWordBank] = useState<string[]>([]);

    const [isAnswerChecked, setIsAnswerChecked] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);

    // Inisialisasi/acak kata saat komponen pertama kali dimuat
    useEffect(() => {
        const shuffled = [...currentQuestion.wordBank].sort(() => Math.random() - 0.5);
        setWordBank(shuffled);
        setAnswerSlots([]); // Reset slot jawaban
    }, [currentQuestion]);

    // --- FUNCTIONS ---
    const handleSelectWord = (word: string) => {
        setWordBank(wordBank.filter(item => item !== word));
        setAnswerSlots([...answerSlots, word]);
    };

    const handleDeselectWord = (word: string, index: number) => {
        setAnswerSlots(answerSlots.filter((_, i) => i !== index));
        setWordBank([...wordBank, word]);
    };

    const handleCheckAnswer = () => {
        const userAnswer = answerSlots.join(" ");
        setIsCorrect(userAnswer === currentQuestion.correctAnswer);
        setIsAnswerChecked(true);
    };

    const handleNextQuestion = () => {
        if (currentQuestionIndex < quizData.questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
            router.back();
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            <Stack.Screen options={{ headerShown: false }} />
            {/* Header Manual */}
            <View className="p-4 flex-row items-center">
                <TouchableOpacity onPress={() => router.back()} className="p-2">
                    <Feather name="arrow-left" size={24} color="gray" />
                </TouchableOpacity>
                <SegmentedProgressBar current={currentQuestionIndex + 1} total={quizData.totalQuestions} />
            </View>

            <View className="flex-1 p-6 justify-between">
                {/* Question Area */}
                <View className="items-center">
                    <Text className="text-2xl font-bold text-gray-800 text-center">What's the meaning of this sentence?</Text>
                    <View className="flex-row items-center bg-gray-100 p-3 rounded-2xl my-6">
                        <Image source={currentQuestion.image} className="w-12 h-12" />
                        <Text className="ml-3 text-lg text-gray-700">{currentQuestion.sentence}</Text>
                    </View>
                </View>

                {/* Answer Slots Area */}
                <View className="border-b-2 border-gray-300 pb-4 min-h-[80px]">
                    <View className="flex-row flex-wrap gap-2">
                        {answerSlots.map((word, index) => (
                            <TouchableOpacity key={index} onPress={() => handleDeselectWord(word, index)}>
                                <Text className="text-lg bg-blue-100 border border-blue-300 p-2 rounded-lg">{word}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Word Bank Area */}
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

            {/* Footer: Check Button atau Feedback Panel */}
            {isAnswerChecked ? (
                <View className={`p-6 rounded-t-2xl ${isCorrect ? 'bg-green-100' : 'bg-red-100'}`}>
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