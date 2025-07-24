// Lokasi: components/games/SusunKalimatQuiz.tsx
import { View, Text, SafeAreaView, TouchableOpacity, Image } from "react-native";
import React, { useState, useEffect } from "react";
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

// --- DUMMY DATA ---
const quizData = {
    totalQuestions: 5,
    questions: [
        {
            id: 1,
            sentence: "Abdi Elis, nami anjeun saha?",
            image: require('@/assets/images/avatar.png'),
            correctAnswer: "I Am Elis , What's Your Name ?",
            wordBank: ["Your", "Elis", "I", "Name", "Am", "What's", "?"], // Seharusnya ini di-generate & diacak
        },
    ],
};

const SegmentedProgressBar = ({ current, total }: ProgressBarProps) => { /* ... (komponen progress bar sama seperti sebelumnya) ... */ };

// --- KOMPONEN UTAMA ---
export default function SusunKalimatQuiz({params}: QuizPageProps) {
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

    const handleNextQuestion = () => { /* ... (logic next question sama seperti sebelumnya) ... */ };

    return (
        <SafeAreaView className="flex-1 bg-white">
            {/* Header (Progress Bar & Back) */}
            {/* ... (komponen header sama seperti sebelumnya) ... */}

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
                    {/* ... (Feedback Panel sama seperti sebelumnya, sesuaikan teks) ... */}
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