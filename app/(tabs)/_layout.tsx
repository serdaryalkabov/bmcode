import Feather from '@expo/vector-icons/Feather';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from "expo-router";

export default function RootLayout() {
    return <Tabs screenOptions={{ tabBarShowLabel: false, headerShown: false, tabBarStyle: { height: 80, paddingTop: 10, backgroundColor: '#2A313C', borderColor: 'none' }, tabBarActiveTintColor: 'white', tabBarInactiveTintColor: 'grey' }}>
        <Tabs.Screen
            options={{ tabBarIcon: ({ color, focused }) => { return <Feather name="home" size={24} color={color} /> } }} name='index' />
        <Tabs.Screen
            options={{ tabBarIcon: ({ color, focused }) => { return <Ionicons name="stats-chart" size={24} color={color} /> } }} name='dashboard' />
        <Tabs.Screen
            options={{ tabBarIcon: ({ color, focused }) => { return <Feather name="settings" size={24} color={color} /> } }} name='settings' />

    </Tabs>;
}
