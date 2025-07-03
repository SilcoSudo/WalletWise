import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { useAuth } from '../hooks/useAuth';
import { useTransactionsContext } from '../hooks/useTransactions';
import HomeScreen from '../screens/HomeScreen';
import TransactionsScreen from '../screens/TransactionsScreen';
import StatisticsScreen from '../screens/StatisticsScreen';
import SettingsScreen from '../screens/SettingsScreen';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import Drawer from '../components/Drawer';

const AppNavigator = ({ isDarkMode, onToggleDarkMode, onAddTransaction }) => {
  const [currentScreen, setCurrentScreen] = useState('home');
  const [showDrawer, setShowDrawer] = useState(false);
  
  const { user, isAuthenticated, logout } = useAuth();
  const { refreshData } = useTransactionsContext();

  // Debug authentication state changes
  useEffect(() => {
    console.log('AppNavigator: Authentication state changed - isAuthenticated:', isAuthenticated, 'user:', user);
  }, [isAuthenticated, user]);

  // Reset app state when authentication changes
  useEffect(() => {
    if (!isAuthenticated) {
      console.log('AppNavigator: User not authenticated, resetting app state');
      setCurrentScreen('home');
      setShowDrawer(false);
    } else {
      console.log('AppNavigator: User authenticated, ensuring navigation to home');
      setCurrentScreen('home');
    }
  }, [isAuthenticated]);

  const handleLogout = async () => {
    try {
      console.log('AppNavigator: Logging out...');
      await logout();
      console.log('AppNavigator: Logout successful');
      setCurrentScreen('home');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleViewAllTransactions = () => {
    setCurrentScreen('transactions');
  };

  const handleScreenChange = (screen) => {
    console.log('Changing screen to:', screen);
    setCurrentScreen(screen);
    setShowDrawer(false);
  };

  const handleAddPress = () => {
    onAddTransaction && onAddTransaction();
  };

  // Main app screens - only render if user is authenticated
  const renderScreen = () => {
    switch (currentScreen) {
      case 'home':
        return (
          <HomeScreen
            isDarkMode={isDarkMode}
            onViewAllTransactions={handleViewAllTransactions}
            onAddTransaction={handleAddPress}
          />
        );
      case 'transactions':
        return (
          <TransactionsScreen
            isDarkMode={isDarkMode}
            onAddTransaction={handleAddPress}
          />
        );
      case 'statistics':
        return (
          <StatisticsScreen
            isDarkMode={isDarkMode}
          />
        );
      case 'settings':
        return (
          <SettingsScreen
            isDarkMode={isDarkMode}
            onToggleDarkMode={onToggleDarkMode}
            onLogout={handleLogout}
            onRefreshData={refreshData}
          />
        );
      default:
        return (
          <HomeScreen
            isDarkMode={isDarkMode}
            onViewAllTransactions={handleViewAllTransactions}
            onAddTransaction={handleAddPress}
          />
        );
    }
  };

  return (
    <View className={`flex-1 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <Header
        onMenuPress={() => setShowDrawer(true)}
        onNotificationPress={() => console.log('Notification pressed')}
        isDarkMode={isDarkMode}
      />

      {/* Main Content */}
      <View className="flex-1">
        {renderScreen()}
      </View>
      
      {/* Bottom Navigation */}
      <BottomNav
        activeScreen={currentScreen}
        onNavigate={handleScreenChange}
        onAddTransaction={handleAddPress}
        isDarkMode={isDarkMode}
      />

      {/* Drawer */}
      <Drawer
        isVisible={showDrawer}
        onClose={() => setShowDrawer(false)}
        activeScreen={currentScreen}
        onNavigate={handleScreenChange}
        onLogout={handleLogout}
        user={user}
        isDarkMode={isDarkMode}
      />
    </View>
  );
};

export default AppNavigator;
