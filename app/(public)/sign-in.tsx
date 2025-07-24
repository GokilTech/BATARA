import { supabase } from "@/lib/supabase";
import { AntDesign, Feather } from "@expo/vector-icons";
import { Link, Stack, useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function LoginPage() {
    const router = useRouter();

    // --- STATE MANAGEMENT ---
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    // State untuk error, biar bisa nampilin pesan seperti di desain
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    // --- FUNCTIONS ---
    const handleLogin = async () => {
        setEmailError('');
        setPasswordError('');
        
        // Ini cuma validasi bohongan, nanti lo ganti pake logic API
        let isValid = true;
        if (!email.includes('@')) {
            setEmailError("Your email is not valid!");
            isValid = false;
        }
        if (password.length < 8) {
            setPasswordError("Your password must be at least 8 characters!");
            isValid = false;
        }
        if(isValid) {
            // Panggil API login di sini
            const { data, error } = await supabase.auth.signInWithPassword({
                email: email,
                password: password,
            });

            if (error) {
                // Tampilkan pesan error jika ada
                console.error("Login Error:", error);
                return;
            } else if (data.user) {
                console.log("Login Success:", data.user);
                // Jika login berhasil, lempar ke HomePage di dalem (auth)
                router.replace('/(Auth)/(tabs)/home');
            }
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            {/* Kita sembunyikan header bawaan biar bersih */}
            <Stack.Screen options={{ headerShown: false }} />

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1 }}>
                <View className="flex-1 justify-center p-8">
                    {/* Logo Section */}
                    <View className="items-center mb-10">
                        <View className="">
                            <Text className="text-5xl font-bold text-primary">BATARA</Text>
                        </View>
                    </View>

                    {/* Form Section */}
                    <View className="space-y-4">
                        {/* Email Input */}
                        <View>
                            <Text className="text-base font-semibold text-gray-500 mb-2">Input your email</Text>
                            <TextInput
                                value={email}
                                onChangeText={setEmail}
                                placeholder="example@gmail.com"
                                keyboardType="email-address"
                                autoCapitalize="none"
                                className={`bg-white p-4 rounded-xl border-2 ${emailError ? 'border-red-500' : 'border-gray-200'}`}
                            />
                            {emailError && <Text className="text-red-500 mt-1">{emailError}</Text>}
                        </View>

                        {/* Password Input */}
                        <View>
                            <Text className="text-base font-semibold text-gray-500 mb-2">Input your Password</Text>
                            <View className={`flex-row items-center bg-white rounded-xl border-2 ${passwordError ? 'border-red-500' : 'border-gray-200'}`}>
                                <TextInput
                                    value={password}
                                    onChangeText={setPassword}
                                    placeholder="********"
                                    secureTextEntry={!isPasswordVisible} // Logik show/hide password
                                    className="flex-1 p-4"
                                />
                                <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)} className="p-4">
                                    <Feather name={isPasswordVisible ? "eye" : "eye-off"} size={20} color="gray" />
                                </TouchableOpacity>
                            </View>
                            {passwordError && <Text className="text-red-500 mt-1">{passwordError}</Text>}
                        </View>
                    </View>

                    {/* Login Button */}
                    <TouchableOpacity onPress={handleLogin} className="bg-primary py-4 rounded-full mt-8">
                        <Text className="text-white text-center font-bold text-lg">Login</Text>
                    </TouchableOpacity>

                    {/* Social Login */}
                    <TouchableOpacity className="flex-row items-center justify-center bg-white py-4 rounded-full mt-4 border-2 border-gray-200">
                        <AntDesign name="google" size={20} color="black" />
                        <Text className="text-gray-800 text-center font-semibold text-base ml-3">Login With Google</Text>
                    </TouchableOpacity>

                    {/* Register Link */}
                    <View className="flex-row justify-center mt-8">
                        <Text className="text-gray-500">Doesn&#39;t have account? </Text>
                        <Link href="./sign-up">
                            <Text className="text-primary font-bold">Register</Text>
                        </Link>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}