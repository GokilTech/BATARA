import { Feather, Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import React, { useState, useEffect, useCallback } from "react";
import { Image, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useFocusEffect } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { useSafeAreaInsets } from "react-native-safe-area-context";



type DashboardItem = {
    id: number;
    // Bilang ke TypeScript kalo 'icon' itu HARUS salah satu nama ikon dari Ionicons
    icon: React.ComponentProps<typeof Ionicons>['name'];
    title: string;
    color: string;
    badgeText?: string; // '?' artinya opsional
    badgeColor?: string;
};

const dashboardItems: DashboardItem[] = [
    { id: 1, icon: "settings-sharp", title: "Settings", color: "bg-blue-500" },
    { id: 2, icon: "trophy", title: "Achievements", color: "bg-orange-400", badgeText: "2 New" },
    {
        id: 3,
        icon: "lock-closed",
        title: "Privacy",
        color: "bg-gray-800",
        badgeText: "Action Needed",
        badgeColor: "bg-red-500"
    },
];

export default function ProfilePage() {
    const router = useRouter();
    const [profile, setProfile] = useState<any>(null);
    const { session } = useAuth();
    const [loading, setLoading] = useState(true);
    const { top } = useSafeAreaInsets()

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
                } catch (error) {
                    console.error("Error fetching home data:", error);
                } finally {
                    setLoading(false);
                }
            };

            fetchData();
        }, [session])
    );

    async function signout() {
        await supabase.auth.signOut();
    }

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            <Stack.Screen options={{ headerShown: false }} />
            {/* --- HEADER SECTION --- */}
            <View className="bg-primary rounded-b-[40px] pt-4 pb-16" style={{ paddingTop: top, marginTop: -top }}>
                {/* Top Nav */}
                <View className="flex-row items-center justify-between px-4">
                    <TouchableOpacity onPress={() => router.back()} className="p-2">
                        <Feather name="arrow-left" size={24} color="white" />
                    </TouchableOpacity>
                    <Text className="text-xl font-bold text-white">My Profile</Text>
                    <TouchableOpacity className="bg-white/20 p-2 rounded-full">
                        <Feather name="menu" size={24} color="white" />
                    </TouchableOpacity>
                </View>

                {/* User Info */}
                <View className="flex-row items-center px-6 mt-6">
                    <Image
                        source={require('../../../assets/images/avatar.png')} // Ganti dengan avatar lo
                        className="w-20 h-20 rounded-full border-4 border-white justify-center items-center"
                    />
                    <View className="flex-1 ml-4">
                        <Text className="text-2xl font-bold text-white">{profile?.full_name}</Text>
                        <Text className="text-base text-white/80">Newbie</Text>
                    </View>
                    <TouchableOpacity className="bg-white/20 p-3 rounded-full">
                        <Feather name="edit-2" size={20} color="white" />
                    </TouchableOpacity>
                </View>
            </View>

            {/* --- STATS BAR SECTION --- */}
            <View className="bg-white rounded-2xl shadow-md p-4 flex-row justify-around mx-6 mt-[-40px]">
                <View className="items-center">
                    <Text className="text-xl font-bold text-gray-800">2+ hours</Text>
                    <Text className="text-sm text-gray-500">Total Learn</Text>
                </View>
                <View className="items-center">
                    <Text className="text-xl font-bold text-gray-800">20</Text>
                    <Text className="text-sm text-gray-500">Achievements</Text>
                </View>
                <View className="items-center">
                    <Text className="text-xl font-bold text-gray-800">2</Text>
                    <Text className="text-sm text-gray-500">Language</Text>
                </View>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                {/* --- MENU CARDS SECTION --- */}
                <View className="p-6 space-y-6 gap-4">
                    {/* Dashboard Card */}
                    <View className="bg-white p-4 rounded-2xl shadow-sm">
                        <Text className="text-lg font-bold text-gray-800 mb-2">Dashboard</Text>
                        <View className="space-y-2">
                            {dashboardItems.map(item => (
                                <TouchableOpacity key={item.id} className="flex-row items-center p-2">
                                    <View className={`${item.color} p-2 rounded-full`}>
                                        <Ionicons name={item.icon} size={20} color="white" />
                                    </View>
                                    <Text
                                        className="flex-1 ml-4 text-base font-semibold text-gray-700">{item.title}</Text>
                                    {item.badgeText && (
                                        <View
                                            className={`px-2 py-1 rounded-full ${item.badgeColor || 'bg-blue-500'}`}>
                                            <Text className="text-xs font-bold text-white">{item.badgeText}</Text>
                                        </View>
                                    )}
                                    <View className="ml-2">
                                        <Feather name="chevron-right" size={20} color="gray" />
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {/* My Account Card */}
                    <View className="bg-white p-4 rounded-2xl shadow-sm">
                        <Text className="text-lg font-bold text-gray-800 mb-2">My Account</Text>
                        <View className="space-y-2">
                            <TouchableOpacity className="p-2">
                                <Text className="text-base text-primary font-semibold">Switch to Another
                                    Account</Text>
                            </TouchableOpacity>
                            <TouchableOpacity className="p-2" onPress={signout}>
                                <Text className="text-base text-red-500 font-semibold">Logout Account</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
