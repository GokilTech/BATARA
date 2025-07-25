import { View, Text, SafeAreaView, ScrollView, ImageBackground, TouchableOpacity, ActivityIndicator } from "react-native";
import React, { useState, useEffect } from "react";
import { Stack, useLocalSearchParams, useRouter, Link } from "expo-router";
import { Feather, Ionicons } from "@expo/vector-icons";
import { supabase } from "@/lib/supabase";

interface BahasaDetail {
    name: string;
    slug: string;
    origin: string;
    description: string;
    image_url: string | null;
}

export default function LanguageDetailPage() {
    const { languageSlug } = useLocalSearchParams<{ languageSlug: string }>();
    const router = useRouter();
    const [bahasa, setBahasa] = useState<BahasaDetail | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBahasaDetail = async () => {
            if (!languageSlug) {
                setLoading(false);
                return;
            }
            setLoading(true);
            try {
                const { data, error } = await supabase
                    .from('bahasa')
                    .select('name, slug, origin, description, image_url')
                    .eq('slug', languageSlug)
                    .single();
                
                if (error) throw error;
                setBahasa(data);

            } catch (err) {
                console.error("Error fetching language detail:", err);
                setBahasa(null);
            } finally {
                setLoading(false);
            }
        };
        fetchBahasaDetail();
    }, [languageSlug]);

    if (loading) {
        return (
            <SafeAreaView className="flex-1 justify-center items-center bg-gray-50">
                <ActivityIndicator size="large" color="#3DB2FF" />
            </SafeAreaView>
        );
    }

    if (!bahasa) {
        return (
            <SafeAreaView className="flex-1 justify-center items-center bg-gray-50 p-6">
                <Stack.Screen options={{ title: "Not Found" }} />
                <Feather name="alert-circle" size={48} color="gray" />
                <Text className="text-xl text-gray-600 mt-4 text-center">Language Not Found</Text>
                <Text className="text-base text-gray-500 text-center mt-2">The language you are looking for does not exist or could not be loaded.</Text>
                <TouchableOpacity onPress={() => router.back()} className="mt-6 bg-primary px-6 py-3 rounded-full">
                    <Text className="text-white font-bold">Go Back</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }
    
    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            <Stack.Screen options={{ headerShown: false }} />
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
                {/* Header Image Section */}
                <ImageBackground
                    source={ bahasa.image_url ? { uri: bahasa.image_url } : require('@/assets/images/avatar.png') }
                    className="h-72"
                >
                    <View className="flex-1 justify-between p-4 bg-black/30">
                        <TouchableOpacity onPress={() => router.back()} className="bg-white/30 p-2 rounded-full self-start mt-4">
                            <Feather name="arrow-left" size={24} color="white" />
                        </TouchableOpacity>
                        <View>
                            <Text className="text-3xl font-bold text-white shadow-lg">{bahasa.name} Language</Text>
                            <Text className="text-base text-white/90 shadow-md">Origin from {bahasa.origin}</Text>
                            <View className="flex-row mt-2">
                                <View className="w-4 h-1.5 bg-white rounded-full mr-1" />
                                <View className="w-1.5 h-1.5 bg-white/50 rounded-full mr-1" />
                                <View className="w-1.5 h-1.5 bg-white/50 rounded-full" />
                            </View>
                        </View>
                    </View>
                </ImageBackground>

                {/* Stats & Actions Bar */}
                <View className="flex-row justify-around bg-white p-4">
                    <TouchableOpacity className="items-center"><Ionicons name="people-outline" size={24} color="gray" /><Text className="text-sm">120</Text></TouchableOpacity>
                    <TouchableOpacity className="items-center"><Ionicons name="stats-chart-outline" size={24} color="gray" /><Text className="text-sm">80%</Text></TouchableOpacity>
                    <TouchableOpacity className="items-center"><Ionicons name="heart-outline" size={24} color="gray" /><Text className="text-sm">Fav</Text></TouchableOpacity>
                    <TouchableOpacity className="items-center"><Ionicons name="ellipsis-horizontal" size={24} color="gray" /><Text className="text-sm">More</Text></TouchableOpacity>
                </View>

                {/* Description Section */}
                <View className="p-6 mt-4">
                    <Text className="text-xl font-bold text-gray-800 mb-2">Description</Text>
                    <Text className="text-base text-gray-600 leading-6">
                        {bahasa.description}
                    </Text>
                </View>

            </ScrollView>

            {/* Sticky Bottom Button */}
            <View className="absolute bottom-0 left-0 right-0 p-6 bg-gray-50 border-t border-gray-200">
                <Link href={`/learning/${languageSlug}`} asChild>
                    <TouchableOpacity className="bg-[#0D2F62] py-4 rounded-full flex-row justify-center items-center">
                        <Text className="text-white text-lg font-bold">Learn Language</Text>
                        <Feather name="arrow-right-circle" size={20} color="white" className="ml-2" />
                    </TouchableOpacity>
                </Link>
            </View>
        </SafeAreaView>
    );
}