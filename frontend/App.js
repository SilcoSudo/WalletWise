import React, { useState, useEffect } from 'react';
import { View, StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider, useAuth } from './src/hooks/useAuth';
import { useTransactionsContext, TransactionsProvider } from './src/hooks/useTransactions';
import { useTheme } from './src/hooks/useTheme';
import AuthNavigator from './src/navigation/AuthNavigator';
import AppNavigator from './src/navigation/AppNavigator';
import './src/utils/i18n'; // Import the i18n configuration
import Toast from 'react-native-toast-message';
import { I18nextProvider } from 'react-i18next';
import i18n from './src/utils/i18n';

// ===================== REFACTORED APP =====================
// Entry point với AuthNavigator và AppNavigator tách biệt, global modal

export default function App() {
  return (
    <I18nextProvider i18n={i18n}>
    <AuthProvider>
      <TransactionsProvider>
        <SafeAreaProvider>
          <MainApp />
        </SafeAreaProvider>
      </TransactionsProvider>
    </AuthProvider>
    </I18nextProvider>
  );
}

function MainApp() {
  const { isDarkMode, toggleTheme } = useTheme();
  const { isAuthenticated } = useAuth();
  const { addTransaction } = useTransactionsContext();
  const [showAddModal, setShowAddModal] = useState(false);

  // Debug authentication state changes
  useEffect(() => {
    console.log('App: Authentication state changed - isAuthenticated:', isAuthenticated);
  }, [isAuthenticated]);

  // Hàm để mở/đóng modal thêm giao dịch
  const handleOpenAddTransaction = () => setShowAddModal(true);
  const handleCloseAddTransaction = () => setShowAddModal(false);

  const handleAddTransaction = async (data) => {
    try {
      await addTransaction(data);
      handleCloseAddTransaction();
      console.log('Transaction added successfully');
    } catch (error) {
      console.error('Failed to add transaction:', error);
    }
  };

  const handleAuthSuccess = (response) => {
    console.log('App: Authentication successful, user:', response.user);
  };

  // If not authenticated, show AuthNavigator
  if (!isAuthenticated) {
    return (
      <>
        <StatusBar 
          barStyle={isDarkMode ? 'light-content' : 'dark-content'} 
          backgroundColor={isDarkMode ? '#111827' : '#f9fafb'} 
        />
        <AuthNavigator 
          isDarkMode={isDarkMode}
          onAuthSuccess={handleAuthSuccess}
          onToggleDarkMode={toggleTheme}
        />
      </>
    );
  }

  // If authenticated, show main app with navigation
  return (
    <>
      <StatusBar 
        barStyle={isDarkMode ? 'light-content' : 'dark-content'} 
        backgroundColor={isDarkMode ? '#111827' : '#f9fafb'} 
      />
      <NavigationContainer>
        <AppNavigator 
          isDarkMode={isDarkMode}
          onToggleDarkMode={toggleTheme}
        />
      </NavigationContainer>
   
      <Toast />
    </>
  );
}