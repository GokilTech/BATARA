import React, { useRef, useMemo, useCallback } from "react";
import BottomSheet, { BottomSheetScrollView, BottomSheetFooter } from "@gorhom/bottom-sheet";
import { View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { BottomSheetDefaultFooterProps } from "@gorhom/bottom-sheet/lib/typescript/components/bottomSheetFooter/types";

const WelcomeScreen = () => {
    const router = useRouter();

    const bottomSheetRef = useRef<BottomSheet>(null);
    const snapPoints = useMemo(() => ['50%', '65%'], []);

    const renderFooter = useCallback(
        (props: React.JSX.IntrinsicAttributes & BottomSheetDefaultFooterProps) => (
            <BottomSheetFooter {...props} bottomInset={50}>
                <View className="px-6">
                    <TouchableOpacity
                        className="flex-row items-center justify-between bg-white border border-primary rounded-full px-6 py-3.5 mb-4"
                        onPress={() => router.push('/sign-up')}
                    >
                        <Text className="text-lg font-bold text-primary">Register</Text>
                        <Feather name="arrow-right" size={24} color="#133E87" />
                    </TouchableOpacity>
                    <TouchableOpacity
                        className="flex-row items-center justify-between bg-white border border-primary rounded-full px-6 py-3.5"
                        onPress={() => router.push('/sign-in')} // Langsung ke home jika login
                    >
                        <Text className="text-lg font-bold text-primary">Login</Text>
                        <Feather name="arrow-right" size={24} color="#133E87" />
                    </TouchableOpacity>
                </View>
            </BottomSheetFooter>
        ),
        []
    );


    return (
        <SafeAreaView className="flex-1 bg-primary">
            <View className="flex-1 justify-center items-center pb-48">
                <Text className="text-5xl font-bold text-white">BATARA</Text>
            </View>
            <BottomSheet
                ref={bottomSheetRef}
                index={0}
                snapPoints={snapPoints}
                handleIndicatorStyle={{ backgroundColor: '#D1D5DB' }}
                backgroundStyle={{ borderTopLeftRadius: 30, borderTopRightRadius: 30 }}
                footerComponent={renderFooter}
            >
                    <View className="items-center pt-4">
                        <Text className="text-2xl text-primary text-center">Learn the local language</Text>
                        <Text className="text-2xl font-bold text-primary text-center mb-4">for free!</Text>
                        <Text className="text-base text-gray-500 text-center mb-6">
                            Learn all local languages interactively at your fingertips!
                        </Text>
                        <View className="flex-row items-center justify-center">
                            <View className="w-4 h-2 bg-primary rounded-full mx-1" />
                            <View className="w-2 h-2 bg-gray-300 rounded-full mx-1" />
                            <View className="w-2 h-2 bg-gray-300 rounded-full mx-1" />
                        </View>
                    </View>
            </BottomSheet>
        </SafeAreaView>
    );
};

export default WelcomeScreen;