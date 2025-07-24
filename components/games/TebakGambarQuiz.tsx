// Lokasi: components/games/TebakGambarQuiz.tsx
import { View, Text, SafeAreaView, TouchableOpacity, Image } from "react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router";
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


// --- DUMMY DATA UNTUK KUIS TEBAK GAMBAR ---
const quiz = {
    totalQuestions: 5,
    questions: [
        {
            id: 1,
            questionText: "What does the picture mean?",
            // Ganti dengan aset gambar lo nanti
            image: require('@/assets/images/avatar.png'), 
            options: ["Sampean", "Soca", "Cepil", "Pangambung"],
            correctAnswer: "Pangambung",
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

export default function TebakGambarQuiz({ params }: QuizPageProps) {
    const router = useRouter();

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [isAnswerChecked, setIsAnswerChecked] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);

    const currentQuestion = quiz.questions[currentQuestionIndex];

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
        if (currentQuestionIndex < quiz.questions.length - 1) {
            // Lanjut ke soal berikutnya (kalau ada)
        } else {
            alert("Quiz Selesai!");
            router.back();
        }
    };
    
    return (
        <SafeAreaView className="flex-1 bg-white">
            <View className="p-4 flex-row items-center">
                <TouchableOpacity onPress={() => router.back()} className="p-2">
                    <Feather name="arrow-left" size={24} color="gray" />
                </TouchableOpacity>
                <SegmentedProgressBar current={currentQuestionIndex + 1} total={quiz.totalQuestions} />
            </View>

            <View className="flex-1 p-6 justify-between">
                <View className="items-center">
                    <Text className="text-2xl font-bold text-gray-800 text-center">{currentQuestion.questionText}</Text>
                    
                    {/* INI DIA BAGIAN GAMBARNYA */}
                    <Image source={currentQuestion.image} className="w-40 h-40 my-8" resizeMode="contain" />
                </View>

                <View className="space-y-4">
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
                                            ? 'bg-[#003B46] border-[#001f25]' // Warna biru tua
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