import { View, Text, SafeAreaView, TouchableOpacity } from "react-native";
import React, { useState, useEffect } from "react";
import { Stack, useRouter, useLocalSearchParams } from "expo-router";
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

const quiz = {
    totalQuestions: 5,
    questions: [
        {
            id: 1,
            question: "What's the meaning of \"Hiji\"?",
            options: ["Empat", "Tiga", "Dua", "Satu"],
            correctAnswer: "Satu",
        },
    ],
};

// --- KOMPONEN BANTU: Progress Bar ---
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
export default function KartuKataQuiz({ params }: QuizPageProps) {
    const router = useRouter();

    // --- STATE MANAGEMENT ---
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [isAnswerChecked, setIsAnswerChecked] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);

    const currentQuestion = quiz.questions[currentQuestionIndex];

    // --- FUNCTIONS ---
    const handleSelectAnswer = (option: string) => {
        if (!isAnswerChecked) {
            setSelectedAnswer(option);
        }
    };

    const handleCheckAnswer = () => {
        if (!selectedAnswer) return;
        const correct = selectedAnswer === currentQuestion.correctAnswer;
        setIsCorrect(correct);
        setIsAnswerChecked(true);
    };

    const handleNextQuestion = () => {
        if (currentQuestionIndex < quiz.questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setSelectedAnswer(null);
            setIsAnswerChecked(false);
            setIsCorrect(false);
        } else {
            alert("Quiz Selesai!");
            router.back(); // Kembali ke learning page setelah kuis selesai
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
                <SegmentedProgressBar current={currentQuestionIndex + 1} total={quiz.totalQuestions} />
            </View>

            {/* Question & Options */}
            <View className="flex-1 p-6 justify-between">
                <View>
                    <Text className="text-3xl font-bold text-gray-800 text-center">{currentQuestion.question}</Text>
                </View>

                <View className="space-y-4 gap-4">
                    {currentQuestion.options.map((option) => (
                        <TouchableOpacity
                            key={option}
                            onPress={() => handleSelectAnswer(option)}
                            disabled={isAnswerChecked}
                            className={`p-4 rounded-2xl border-b-4
                                ${
                                    isAnswerChecked
                                        ? option === currentQuestion.correctAnswer
                                            ? 'bg-green-400 border-green-600'
                                            : option === selectedAnswer
                                            ? 'bg-red-400 border-red-600'
                                            : 'bg-blue-400 border-blue-600'
                                        : selectedAnswer === option
                                            ? 'bg-blue-600 border-blue-800'
                                            : 'bg-blue-400 border-blue-600'
                                }
                            `}
                        >
                            <Text className="text-xl font-bold text-white text-center">{option}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            {/* Footer: Check Button atau Feedback Panel */}
            {isAnswerChecked ? (
                // Feedback Panel
                <View className={`p-6 rounded-t-2xl ${isCorrect ? 'bg-green-100' : 'bg-red-100'}`}>
                    <Text className={`text-2xl font-bold ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                        {isCorrect ? "Bagus!" : "Ups, jawaban salah"}
                    </Text>
                    <Text className="text-base text-gray-700 mt-1">Jawaban: {currentQuestion.correctAnswer}</Text>
                    <TouchableOpacity
                        onPress={handleNextQuestion}
                        className={`py-4 rounded-full mt-4 ${isCorrect ? 'bg-green-500' : 'bg-red-500'}`}
                    >
                        <Text className="text-white text-center font-bold text-lg">Next Question</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                // Check Button
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