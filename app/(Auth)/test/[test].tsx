import { View, Text, SafeAreaView, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { useLocalSearchParams, Stack, useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";

// --- DUMMY DATA UNTUK TES ---
const quizData = [
    {
        question: "What's the meaning of this sentence?",
        sentence: "Punten, nami abdi Asep",
        options: ["Hi, my name is Asep", "Excuse me, my name is Asep", "Where are you, Asep?", "My name is Asep"],
        correctAnswer: "Excuse me, my name is Asep",
    },
    {
        question: "What does 'Hatur Nuhun' mean?",
        sentence: null,
        options: ["You're welcome", "I am sorry", "Thank you", "Good bye"],
        correctAnswer: "Thank you",
    },
];

// --- KOMPONEN UTAMA ---
export default function TestPage() {
    const router = useRouter();
    const { testId } = useLocalSearchParams();

    // --- STATE MANAGEMENT (Sama seperti sebelumnya) ---
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [isAnswerChecked, setIsAnswerChecked] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);

    const totalQuestions = quizData.length;
    const currentQuestion = quizData[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;

    // --- FUNCTIONS (Sama seperti sebelumnya) ---
    const handleSelectAnswer = (option: string) => {
        if (!isAnswerChecked) setSelectedAnswer(option);
    };

    const handleCheckAnswer = () => {
        if (!selectedAnswer) return;
        const correct = selectedAnswer === currentQuestion.correctAnswer;
        setIsCorrect(correct);
        setIsAnswerChecked(true);
    };

    const handleNextQuestion = () => {
        setSelectedAnswer(null);
        setIsAnswerChecked(false);
        setIsCorrect(false);

        if (currentQuestionIndex < totalQuestions - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
            alert("Quiz Finished!");
            router.back();
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            <Stack.Screen options={{ headerShown: false }} />

            {/* Header Manual */}
            <View className="p-4 flex-row items-center border-b border-gray-200">
                <TouchableOpacity onPress={() => router.back()} className="p-2">
                    <Feather name="x" size={24} color="gray" />
                </TouchableOpacity>
                <View className="flex-1 h-2.5 bg-gray-200 rounded-full mx-4">
                    <View style={{ width: `${progress}%` }} className="h-2.5 bg-brandGreen rounded-full" />
                </View>
            </View>

            {/* Question Area */}
            <View className="flex-1 p-6">
                <Text className="text-2xl font-bold text-gray-800">{currentQuestion.question}</Text>
                {currentQuestion.sentence && (
                    <Text className="text-xl text-gray-600 my-4 bg-gray-100 p-4 rounded-lg">
                        "{currentQuestion.sentence}"
                    </Text>
                )}

                {/* Answer Options dengan full Tailwind */}
                <View className="mt-8">
                    {currentQuestion.options.map((option, index) => (
                        <TouchableOpacity
                            key={index}
                            onPress={() => handleSelectAnswer(option)}
                            disabled={isAnswerChecked}
                            className={`p-4 rounded-xl mb-3 border-2
                                ${
                                isAnswerChecked
                                    ? option === currentQuestion.correctAnswer
                                        ? 'border-brandGreen bg-green-100' // Jawaban Benar
                                        : option === selectedAnswer
                                            ? 'border-red-500 bg-red-100'    // Pilihan User (Salah)
                                            : 'border-gray-200 bg-gray-50'    // Opsi lain (netral)
                                    : selectedAnswer === option
                                        ? 'border-primary bg-blue-100'      // Sedang dipilih
                                        : 'border-gray-200 bg-gray-50'      // Default
                            }
                            `}
                        >
                            <Text className="text-base font-semibold text-gray-800">{option}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            {/* Feedback & Check Button Area */}
            {isAnswerChecked ? (
                <View className={`p-6 rounded-t-2xl ${isCorrect ? 'bg-brandGreen' : 'bg-red-500'}`}>
                    <Text className="text-xl font-bold text-white">{isCorrect ? "Amazing!" : "Oops, that's wrong"}</Text>
                    <Text className="text-base text-white">Answer: {currentQuestion.correctAnswer}</Text>
                    <TouchableOpacity onPress={handleNextQuestion} className="bg-white py-3 px-8 rounded-full mt-4 self-start">
                        <Text className={`text-lg font-bold ${isCorrect ? 'text-brandGreen' : 'text-red-500'}`}>
                            Next Question
                        </Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <View className="p-6 border-t border-gray-200">
                    <TouchableOpacity
                        onPress={handleCheckAnswer}
                        disabled={!selectedAnswer}
                        className={`py-4 rounded-full ${!selectedAnswer ? 'bg-gray-300' : 'bg-brandGreen'}`}
                    >
                        <Text className="text-white text-center font-bold text-lg">Check Answer</Text>
                    </TouchableOpacity>
                </View>
            )}
        </SafeAreaView>
    );
}