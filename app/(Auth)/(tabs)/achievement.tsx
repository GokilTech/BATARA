import { View, Text, SafeAreaView, TouchableOpacity, ScrollView } from "react-native";
import React from "react";
import { Stack } from "expo-router";
import { Feather, Ionicons, FontAwesome5 } from "@expo/vector-icons";
import CircularProgress from 'react-native-circular-progress-indicator';

type StarRatingProps = {
    rating: number;
    totalStars?: number;
};

const StarRating = ({ rating, totalStars = 5 }: StarRatingProps) => {
    const filledStars = Math.floor(rating);
    const emptyStars = totalStars - filledStars;

    return (
        <View className="flex-row">
            {[...Array(filledStars)].map((_, i) => <Ionicons key={`filled-${i}`} name="star" size={16} color="#FFC700" />)}
            {[...Array(emptyStars)].map((_, i) => <Ionicons key={`empty-${i}`} name="star-outline" size={16} color="#FFC700" />)}
        </View>
    );
};

// --- DUMMY DATA ---
const achievements = [
    { id: 1, title: "Studious", desc: "You have completed this lesson 10 times.", icon: "trophy", rating: 3, color: "bg-blue-400" },
    { id: 2, title: "Quickie", desc: "You have completed this quiz in less than 3 minutes, 10 times.", icon: "clock", rating: 4, color: "bg-orange-400" },
    { id: 3, title: "Ambitious", desc: "You have achieved 15 milestones.", icon: "ribbon", rating: 2, color: "bg-teal-500" },
    { id: 4, title: "Perfectionist", desc: "You have scored 100% on quizzes 20 times.", icon: "star", rating: 5, color: "bg-indigo-500" },
];

// --- KOMPONEN UTAMA ---
export default function AchievementPage() {
    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            <Stack.Screen options={{ headerShown: false }} />

            {/* Header Kustom */}
            <View className="flex-row justify-between items-center p-4">
                <View className="w-10 h-10" />
                <Text className="text-xl font-bold text-gray-800">Achievement</Text>
                <TouchableOpacity className="bg-white p-2 rounded-full shadow-sm">
                    <Feather name="menu" size={24} color="black" />
                </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 24 }}>
                {/* Summary Card */}
                <View className="bg-white p-6 rounded-2xl shadow-sm flex-row items-center mb-6">
                    <CircularProgress
                        value={80}
                        radius={45}
                        duration={2000}
                        progressValueColor={'#27AE60'}
                        activeStrokeColor={'#27AE60'}
                        inActiveStrokeColor={'#D1FAE5'}
                        maxValue={100}
                        title={'%'}
                        titleStyle={{ fontWeight: 'bold' }}
                    />
                    <View className="flex-1 ml-4">
                        <Text className="text-lg font-bold text-gray-800">Total Achivements : 20</Text>
                        <Text className="text-sm text-gray-500 mt-1">Great job, John! Complete your achievements now</Text>
                    </View>
                </View>

                {/* Achievements List */}
                <View className="space-y-4 gap-4">
                    {achievements.map((item) => (
                        <View key={item.id} className={`${item.color} p-4 rounded-2xl flex-row items-center`}>
                            <View className="bg-white/30 p-4 rounded-full">
                                <FontAwesome5 name={item.icon} size={24} color="white" />
                            </View>
                            <View className="flex-1 ml-4">
                                <Text className="text-lg font-bold text-white">{item.title}</Text>
                                <View className="my-1">
                                    <StarRating rating={item.rating} />
                                </View>
                                <Text className="text-sm text-white/90">{item.desc}</Text>
                            </View>
                        </View>
                    ))}
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}