import { supabase } from "@/lib/supabase";
import { Feather } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import React, { useState } from "react";
import {
    Alert,
    KeyboardAvoidingView,
    KeyboardTypeOptions,
    Platform,
    SafeAreaView,
    ScrollView,
    Text,
    TextInput, TouchableOpacity,
    View
} from "react-native";




type StepConfig = {
    title: string;
    value: string;
    setValue: React.Dispatch<React.SetStateAction<string>>;
    placeholder: string;
    keyboardType: KeyboardTypeOptions;
    nextLabel: string;
};

// --- KOMPONEN UTAMA ---
export default function RegisterFlowScreen() {
    const router = useRouter();

    const [step, setStep] = useState(0);
    const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    // 3. Terapkan tipe 'Checklist' ke blueprint kita
    const steps: StepConfig[] = [
        { title: "How old are you?", value: age, setValue: setAge, placeholder: "21", keyboardType: "numeric", nextLabel: "Next" },
        { title: "What is your name?", value: name, setValue: setName, placeholder: "John Doe", keyboardType: "default", nextLabel: "Next" },
        { title: "What is your email, King Akhdan?", value: email, setValue: setEmail, placeholder: "john.doe@mail.com", keyboardType: "email-address", nextLabel: "Next" },
        { title: "Set up your password", value: password, setValue: setPassword, placeholder: "********", keyboardType: "default", nextLabel: "Start" },
    ];

    const currentStep = steps[step];

    const handleNext = () => {
        if (step < steps.length - 1) {
            setStep(step + 1);
        } else {
            handleSubmit();
        }
    };

    const handleSubmit = async () => {
        const parsedAge = parseInt(age, 10);
if (isNaN(parsedAge)) {
  return;
}
        const userData = { name, age, email, password };
        console.log("User Data Submitted:", userData);
        const { data, error } = await supabase.auth.signUp(
        {
            email: email,
            password: password,
            options: {
            data: {
                full_name: name,
                age: age,
            }
            }
        })
        
        if (error) {
            console.error("Registration Error:", error);
        } else {
            router.replace('/sign-in');
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            <Stack.Screen options={{ headerShown: false }} />

            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                className="flex-1"
            >
                {/* Header dengan tombol back */}
                <View className="px-4 pt-4">
                    <TouchableOpacity onPress={() => step > 0 ? setStep(step - 1) : router.back()} className="p-2 self-start">
                        <Feather name="arrow-left" size={24} color="black" />
                    </TouchableOpacity>
                </View>

                {/* Ganti ScrollView biar kontennya bisa di-scroll kalau layar kependekan */}
                <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }} keyboardShouldPersistTaps="handled">
                    <View className="p-8 items-center">
                        <Text className="text-2xl font-bold text-gray-800 text-center mb-8">
                            {currentStep.title}
                        </Text>
                        <View className="w-full relative">
                            <TextInput
                                value={currentStep.value}
                                onChangeText={currentStep.setValue}
                                placeholder={currentStep.placeholder}
                                keyboardType={currentStep.keyboardType} // <-- SEKARANG INI AMAN!
                                secureTextEntry={currentStep.title.includes("password") && !isPasswordVisible}
                                className="w-full bg-white p-4 rounded-full border-2 border-primary text-center text-lg"
                            />
                            {currentStep.title.includes("password") && (
                                <TouchableOpacity
                                    onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                                    className="absolute right-4 self-center"
                                    style={{ top: 16 }} // Penyesuaian posisi vertikal
                                >
                                    <Feather name={isPasswordVisible ? "eye" : "eye-off"} size={24} color="gray" />
                                </TouchableOpacity>
                            )}
                        </View>
                        {currentStep.title.includes("password") && (
                            <Text className="text-green-500 mt-2 text-xs">How strong your password: Super Strong</Text>
                        )}
                    </View>
                </ScrollView>

                {/* Tombol Bawah */}
                <View className="px-8 pb-8">
                    <TouchableOpacity
                        onPress={handleNext}
                        className="bg-primary w-full py-4 rounded-full"
                    >
                        <Text className="text-white text-center font-bold text-lg">
                            {currentStep.nextLabel}
                        </Text>
                    </TouchableOpacity>
                    {step === 0 && (
                        <TouchableOpacity onPress={handleNext} className="mt-4">
                            <Text className="text-gray-500 text-center font-semibold">Skip</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}