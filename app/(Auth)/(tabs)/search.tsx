import {
    View,
    Text,
    SafeAreaView,
    TextInput,
    TouchableOpacity,
    ScrollView,
    FlatList,
    Image
} from "react-native";
import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { Stack, useFocusEffect } from "expo-router";
import { Feather, Ionicons } from "@expo/vector-icons";
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from "../../../context/AuthContext";
import { supabase } from "../../../lib/supabase";

type PopularLanguage = {
    id: string;
    name: string;
};

type PreviousCourse = {
    id: string;
    name: string;
    subtitle: string;
    icon: React.ComponentProps<typeof Feather>['name'];
};

interface LanguageStats {
    id: number;
    name: string;
    slug: string;
    progress: number;
    highest_level: number;
}

const categories: string[] = ["#Sunda", "#Javanese", "#Bali"];

const previousCourses: PreviousCourse[] = [
    { id: '1', name: 'Sundanese', subtitle: 'Introduction', icon: 'book' },
    { id: '2', name: 'Balinese', subtitle: 'Grammar', icon: 'file-text' },
    { id: '3', name: 'Aceh', subtitle: 'Pronunciation', icon: 'mic' },
];

export default function SearchPage() {
    const [activeCategory, setActiveCategory] = useState("#Sunda");
    const [searchQuery, setSearchQuery] = useState("");
    const [languages, setLanguages] = useState<LanguageStats[]>([]);
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const { session } = useAuth();

    useFocusEffect(
        useCallback(() => {
            const fetchData = async () => {
                if (!session?.user) return;

                try {
                    const { data: profileData, error: profileError } = await supabase
                        .from("profiles")
                        .select("full_name")
                        .eq("id", session.user.id)
                        .single();
                    if (profileError) throw profileError;
                    setProfile(profileData);

                    const { data: languagesData, error: rpcError } = await supabase.rpc(
                        "get_user_bahasa_stats",
                        { p_user_id: session.user.id }
                    );
                    if (rpcError) throw rpcError;
                    setLanguages(languagesData || []);
                } catch (error) {
                    console.error("Error fetching home data:", error);
                } finally {
                    setLoading(false);
                }
            };

            fetchData();
        }, [session])
    );

    return (
        <SafeAreaView className="flex-1 bg-primary">
            <Stack.Screen options={{ headerShown: false }} />
            <View className="bg-primary">
                <LinearGradient
                    colors={['#133E87', 'rgba(221, 236, 255, 0.7)']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                >
                    <View className="h-48 justify-between flex-row items-center">
                        <View className="pl-6">
                            <Text className="text-3xl font-bold text-white">Which Language</Text>
                            <Text className="text-xl text-white">would you like to learn?</Text>
                        </View>
                        <Image
                            source={require('../../../assets/images/awan.png')}
                            className="w-32 h-36"
                            resizeMode="contain"
                        />
                    </View>
                </LinearGradient>

                {/* Search & Category Section (Tidak Berubah) */}
                <View className="px-6 bg-white">
                    <View className="flex-row items-center bg-white p-4 rounded-full shadow-md mt-[-28px]">
                        <Feather name="search" size={20} color="gray" />
                        <TextInput
                            placeholder="Search Language..."
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            className="flex-1 ml-3"
                        />
                    </View>
                    <View className="mt-6 flex-row items-center">
                        <Text className="text-base font-semibold text-gray-700 mr-4">Category:</Text>
                        <View className="flex-row space-x-2 gap-2">
                            {categories.map(cat => (
                                <TouchableOpacity
                                    key={cat}
                                    onPress={() => setActiveCategory(cat)}
                                    className={`px-4 py-2 rounded-full ${activeCategory === cat ? 'bg-primary' : 'bg-gray-200'}`}
                                >
                                    <Text
                                        className={`${activeCategory === cat ? 'text-white' : 'text-gray-600'} font-semibold`}>
                                        {cat}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                </View>

                {/* --- 2. POPULAR LANGUAGES DENGAN PLACEHOLDER --- */}
                <View className="pt-6 bg-white">
                    <FlatList
                        data={languages}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ paddingHorizontal: 24 }}
                        keyExtractor={item => item.id.toString()}
                        renderItem={({ item }) => (
                            <TouchableOpacity className="mr-4 items-center">
                                <View className="w-24 h-24 rounded-2xl bg-gray-200 justify-center items-center">
                                    <Feather name="image" size={32} color="gray" />
                                </View>
                                <Text className="mt-2 font-semibold text-gray-800">{item.name}</Text>
                            </TouchableOpacity>
                        )}
                    />
                </View>

                {/* Previous Courses Section (Sekarang Type-Safe) */}
                <View className="pt-8 px-6 pb-24 bg-white">
                    <Text className="xl font-bold text-gray-800 mb-4">
                        Previous Language Courses
                    </Text>
                    <ScrollView className="h-full">
                        {previousCourses.map(course => (
                            <TouchableOpacity key={course.id}
                                className="flex-row items-center bg-white p-4 rounded-xl border border-gray-100">
                                <View className="p-3 bg-blue-100 rounded-lg">
                                    {/* SEKARANG AMAN! TypeScript tahu 'course.icon' adalah nama ikon Feather yang valid. */}
                                    <Feather name={course.icon} size={20} color="#3DB2FF" />
                                </View>
                                <View className="flex-1 ml-4">
                                    <Text className="text-base font-bold text-gray-800">{course.name}</Text>
                                    <Text className="text-sm text-gray-500">{course.subtitle}</Text>
                                </View>
                                <Feather name="chevron-right" size={24} color="gray" />
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            </View>
        </SafeAreaView>
    );
}