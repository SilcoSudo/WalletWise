import React, { useState } from 'react';
import { View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useAuth } from '../hooks/useAuth';
import Drawer from '../components/Drawer';
import HomeScreen from '../screens/HomeScreen';
import TransactionsScreen from '../screens/TransactionsScreen';
import StatisticsScreen from '../screens/StatisticsScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Tab = createBottomTabNavigator();

// Tab Navigator
const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'Transactions') {
            iconName = 'list';
          } else if (route.name === 'Statistics') {
            iconName = 'chart-bar';
          } else if (route.name === 'Settings') {
            iconName = 'cog';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#2563eb',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Transactions" component={TransactionsScreen} />
      <Tab.Screen name="Statistics" component={StatisticsScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
};

// Main App Navigator
const AppNavigator = () => {
  const { user, logout } = useAuth();
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [activeScreen, setActiveScreen] = useState('Home');

  if (!user) {
    return null; // This should not happen as we're in the authenticated flow
  }

  const handleNavigate = (screen) => {
    setActiveScreen(screen);
    setIsDrawerVisible(false);
    // Note: In a real app, you'd use navigation.navigate here
    console.log('Navigate to:', screen);
  };

  const handleLogout = () => {
    setIsDrawerVisible(false);
    logout();
  };

  return (
    <View style={{ flex: 1 }}>
      <TabNavigator />
      
      {/* Global Drawer */}
      <Drawer
        isVisible={isDrawerVisible}
        onClose={() => setIsDrawerVisible(false)}
        activeScreen={activeScreen}
        onNavigate={handleNavigate}
        onLogout={handleLogout}
        user={user}
      />
    </View>
  );
};

export default AppNavigator;
