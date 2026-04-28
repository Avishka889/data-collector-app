import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from 'react-native';

const Colors = {
  primary: '#15B4C2', // Exact Cyan/Teal from logo
  secondary: '#F6AC1B', // Exact Orange/Gold from logo
  background: '#F8FAFC',
  card: '#FFFFFF',
  text: '#1E293B',
  textLight: '#64748B',
};

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textLight,
        headerStyle: {
          backgroundColor: Colors.primary,
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        tabBarStyle: {
          backgroundColor: Colors.card,
          borderTopColor: '#E2E8F0',
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Form',
          headerTitle: 'WellMed Specialist Centre',
          headerTitleAlign: 'center',
          tabBarIcon: ({ color }) => <Ionicons name="document-text-outline" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="qr"
        options={{
          title: 'Patient QR',
          headerTitle: 'Share with Patient',
          headerTitleAlign: 'center',
          tabBarIcon: ({ color }) => <Ionicons name="qr-code-outline" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Dashboard',
          headerTitle: 'Owner Dashboard',
          headerTitleAlign: 'center',
          tabBarIcon: ({ color }) => <Ionicons name="stats-chart-outline" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
