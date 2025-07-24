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