import React, { useState, useEffect } from 'react';
import { View, StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider, useAuth } from './src/hooks/useAuth';
import { useTransactions } from './src/hooks/useTransactions';
import { useTheme } from './src/hooks/useTheme';
import LoginScreen from './src/screens/LoginScreen';
import SignupScreen from './src/screens/SignupScreen';
import HomeScreen from './src/screens/HomeScreen';
import TransactionsScreen from './src/screens/TransactionsScreen';
import StatisticsScreen from './src/screens/StatisticsScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import Header from './src/components/Header';
import BottomNav from './src/components/BottomNav';
import Drawer from './src/components/Drawer';
import ModalAddTransaction from './src/components/ModalAddTransaction';

export default function App() {
  // Wrap the entire app with AuthProvider
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}

function MainApp() {
  const [currentScreen, setCurrentScreen] = useState('home');
  const [showDrawer, setShowDrawer] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  
  const { isDarkMode, toggleTheme } = useTheme();
  const { user, isAuthenticated, login, register, guestLogin, logout } = useAuth();
  const { addTransaction, refreshData } = useTransactions(isAuthenticated);

  // Debug authentication state changes
  useEffect(() => {
    console.log('App: Authentication state changed - isAuthenticated:', isAuthenticated, 'user:', user);
  }, [isAuthenticated, user]);

  // Reset app state when authentication changes
  useEffect(() => {
    if (!isAuthenticated) {
      console.log('App: User not authenticated, resetting app state');
      // Reset all state when user logs out
      setCurrentScreen('home');
      setShowDrawer(false);
      setShowAddModal(false);
      setShowSignup(false);
    } else {
      console.log('App: User authenticated, ensuring navigation to home');
      // Ensure we're on home screen when authenticated
      setCurrentScreen('home');
    }
  }, [isAuthenticated]);

  const handleLogin = (response) => {
    console.log('App: Login successful, user:', response.user);
    setShowSignup(false);
    // Force navigation to home screen after successful login
    setCurrentScreen('home');
  };

  const handleSignup = (response) => {
    console.log('App: Signup successful, user:', response.user);
    setShowSignup(false);
    // Force navigation to home screen after successful signup
    setCurrentScreen('home');
  };

  const handleGuestLogin = (response) => {
    console.log('App: Guest login successful, user:', response.user);
    setShowSignup(false);
    // Force navigation to home screen after successful guest login
    setCurrentScreen('home');
  };

  const handleLogout = async () => {
    try {
      console.log('App: Logging out...');
      await logout();
      console.log('App: Logout successful');
      // Reset to login screen after logout
      setCurrentScreen('home');
      setShowSignup(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleAddTransaction = async (transactionData) => {
    try {
      await addTransaction(transactionData);
      setShowAddModal(false);
      console.log('Transaction added successfully');
    } catch (error) {
      console.error('Failed to add transaction:', error);
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
    setShowAddModal(true);
  };

  // If not authenticated, show login/signup screens
  if (!isAuthenticated) {
    return (
      <SafeAreaProvider>
        <View className={`flex-1 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
          <StatusBar 
            barStyle={isDarkMode ? 'light-content' : 'dark-content'} 
            backgroundColor={isDarkMode ? '#111827' : '#f9fafb'} 
          />
          
          {showSignup ? (
            <SignupScreen
              isDarkMode={isDarkMode}
              onSignup={handleSignup}
              onBackToLogin={() => setShowSignup(false)}
            />
          ) : (
            <LoginScreen
              isDarkMode={isDarkMode}
              onLogin={handleLogin}
              onSignup={() => setShowSignup(true)}
              onGuestLogin={handleGuestLogin}
            />
          )}
        </View>
      </SafeAreaProvider>
    );
  }

  // Main app screens - only render if user is authenticated
  const renderScreen = () => {
    switch (currentScreen) {
      case 'home':
        return (
          <HomeScreen
            isDarkMode={isDarkMode}
            onViewAllTransactions={handleViewAllTransactions}
            onAddTransaction={() => setShowAddModal(true)}
          />
        );
      case 'transactions':
        return (
          <TransactionsScreen
            isDarkMode={isDarkMode}
            onAddTransaction={() => setShowAddModal(true)}
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
            onLogout={handleLogout}
            onRefreshData={refreshData}
          />
        );
      default:
        return (
          <HomeScreen
            isDarkMode={isDarkMode}
            onViewAllTransactions={handleViewAllTransactions}
            onAddTransaction={() => setShowAddModal(true)}
          />
        );
    }
  };

  return (
    <SafeAreaProvider>
      <View className={`flex-1 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <StatusBar 
          barStyle={isDarkMode ? 'light-content' : 'dark-content'} 
          backgroundColor={isDarkMode ? '#111827' : '#f9fafb'} 
        />
        
        {/* Header */}
        <Header
          onMenuPress={() => setShowDrawer(true)}
          onNotificationPress={() => console.log('Notification pressed')}
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
        />

        {/* Add Transaction Modal */}
        <ModalAddTransaction
          visible={showAddModal}
          onClose={() => setShowAddModal(false)}
          onAddTransaction={handleAddTransaction}
          isDarkMode={isDarkMode}
        />
      </View>
    </SafeAreaProvider>
  );
}