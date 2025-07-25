import { Stack, router } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';

export default function AuthLayout() {
    return (
        <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="game" options={{headerShown: false}}/>
            <Stack.Screen
                name="learning/[languageSlug]"
                options={{
                    headerTitle: "",
                    headerTransparent: true,
                    headerRight: () => (
                        <TouchableOpacity onPress={() => alert('Menu pressed!')} className="pr-4">
                            <Feather name="more-horizontal" size={24} color="black" />
                        </TouchableOpacity>
                    ),
                    headerLeft: () => (
                        <TouchableOpacity onPress={() => router.back()} className="pl-4">
                            <Feather name="arrow-left" size={24} color="black" />
                        </TouchableOpacity>
                    ),
                }}
            />
        </Stack>
    );
}