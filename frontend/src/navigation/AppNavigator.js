import React, { useState } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useAuth } from '../hooks/useAuth';
import Drawer from '../components/Drawer';
import HomeScreen from '../screens/HomeScreen';
import TransactionsScreen from '../screens/TransactionsScreen';
import StatisticsScreen from '../screens/StatisticsScreen';
import SettingsScreen from '../screens/SettingsScreen';
import { LinearGradient } from 'expo-linear-gradient';

const Tab = createBottomTabNavigator();

// ===================== ĐIỀU HƯỚNG CHÍNH (NAVIGATION) =====================
// File này định nghĩa cấu trúc điều hướng chính của app, custom tab bar với nút cộng nổi giữa, truyền hàm thêm giao dịch toàn cục.

// Custom Tab Bar với nút + ở giữa
function CustomTabBar({ state, descriptors, navigation, onAddTransaction }) {
  return (
    <View style={{ height: 72, backgroundColor: '#fff', borderTopWidth: 1, borderColor: '#e5e7eb' }}>
      {/* Nút cộng nổi giữa */}
      <View style={{ position: 'absolute', alignSelf: 'center', bottom: 16, zIndex: 10 }}>
        <LinearGradient
          colors={['#667eea', '#764ba2']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ width: 64, height: 64, borderRadius: 32, alignItems: 'center', justifyContent: 'center', elevation: 8, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, borderWidth: 4, borderColor: '#fff' }}
        >
          <TouchableOpacity onPress={onAddTransaction} style={{ width: 64, height: 64, alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="plus" size={32} color="#fff" />
          </TouchableOpacity>
        </LinearGradient>
      </View>
      {/* Các tab chia đều hai bên */}
      <View style={{ flexDirection: 'row', height: 72, alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 24 }}>
        {state.routes.map((route, index) => {
          // Bỏ tab Add khỏi tab bar (nút cộng đã custom riêng)
          if (route.name === 'Add') return null;
          const { options } = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
              ? options.title
              : route.name;
          const isFocused = state.index === index;
          let iconName = 'home';
          if (route.name === 'Home') iconName = 'home';
          if (route.name === 'Transactions') iconName = 'list';
          if (route.name === 'Statistics') iconName = 'chart-bar';
          if (route.name === 'Settings') iconName = 'cog';
          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={() => navigation.navigate(route.name)}
              style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
            >
              <Icon name={iconName} size={22} color={isFocused ? '#2563eb' : '#6b7280'} />
              <Text style={{ color: isFocused ? '#2563eb' : '#6b7280', fontSize: 12, marginTop: 2 }}>{label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

// Main App Navigator
const AppNavigator = ({ onAddTransaction }) => {
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
      <TabNavigator onAddTransaction={onAddTransaction} />
      
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

const TabNavigator = ({ onAddTransaction }) => {
  return (
    <Tab.Navigator
      tabBar={props => <CustomTabBar {...props} onAddTransaction={onAddTransaction} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarLabel: 'Trang chủ' }} />
      <Tab.Screen name="Add" component={() => null} options={{ tabBarLabel: '' }} listeners={{ tabPress: e => e.preventDefault() }} />
      <Tab.Screen name="Transactions" component={TransactionsScreen} options={{ tabBarLabel: 'Giao dịch' }} />
      <Tab.Screen name="Statistics" component={StatisticsScreen} options={{ tabBarLabel: 'Thống kê' }} />
      <Tab.Screen name="Settings" component={SettingsScreen} options={{ tabBarLabel: 'Cài đặt' }} />
    </Tab.Navigator>
  );
};

export default AppNavigator;
