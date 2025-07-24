import { Feather } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: "#4A90E2",
                tabBarInactiveTintColor: "gray",
                tabBarStyle: {
                    backgroundColor: "white",
                    paddingTop: 5,
                    borderTopWidth: 0, // Biar lebih bersih
                    elevation: 10, // Shadow untuk Android
                    shadowOpacity: 0.1, // Shadow untuk iOS
                },
                headerShown: false,
            }}
        >
            <Tabs.Screen
                name="home"
                options={{
                    title: "Learn",
                    tabBarIcon: ({ color }) => <Feather name="book-open" size={24} color={color} />,
                }}
            />
            <Tabs.Screen
                name="search"
                options={{
                    title: "Search",
                    tabBarIcon: ({ color }) => <Feather name="search" size={24} color={color} />,
                }}
            />
            <Tabs.Screen
                name="achievement"
                options={{
                    title: "Achievement",
                    tabBarIcon: ({ color }) => <Feather name="award" size={24} color={color} />,
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: "Profile",
                    tabBarIcon: ({ color }) => <Feather name="user" size={24} color={color} />,
                }}
            />
        </Tabs>
    );
}