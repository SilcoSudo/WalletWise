import React, { useState, useEffect } from 'react';
import { View, StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider, useAuth } from './src/hooks/useAuth';
import { useTransactionsContext, TransactionsProvider } from './src/hooks/useTransactions';
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
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';

// ===================== FILE GỐC APP =====================
// Đây là entry point của app, bọc các provider context, tích hợp modal thêm giao dịch toàn cục, truyền hàm mở modal xuống navigation.

export default function App() {
  return (
    <AuthProvider>
      <TransactionsProvider>
        <SafeAreaProvider style={{ paddingTop: 40 }}>
          <NavigationWithGlobalAddTransaction />
        </SafeAreaProvider>
      </TransactionsProvider>
    </AuthProvider>
  );
}

function NavigationWithGlobalAddTransaction() {
  const { addTransaction } = useTransactionsContext();
  const [showAddModal, setShowAddModal] = useState(false);

  // Hàm này sẽ được truyền xuống các màn hình/tab bar để mở modal
  const handleOpenAddTransaction = () => setShowAddModal(true);
  const handleCloseAddTransaction = () => setShowAddModal(false);

  return (
    <>
      <NavigationContainer>
        <AppNavigator onAddTransaction={handleOpenAddTransaction} />
      </NavigationContainer>
      <ModalAddTransaction
        visible={showAddModal}
        onClose={handleCloseAddTransaction}
        onAddTransaction={async (data) => {
          await addTransaction(data);
          handleCloseAddTransaction();
        }}
      />
    </>
  );
}

function MainEntry() {
  const { isDarkMode } = useTheme();
  const { isAuthenticated } = useAuth();
  const [showSignup, setShowSignup] = useState(false);

  if (!isAuthenticated) {
    return (
      <View className={`flex-1 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <StatusBar 
          barStyle={isDarkMode ? 'light-content' : 'dark-content'} 
          backgroundColor={isDarkMode ? '#111827' : '#f9fafb'} 
        />
        {showSignup ? (
          <SignupScreen
            isDarkMode={isDarkMode}
            onSignup={() => setShowSignup(false)}
            onBackToLogin={() => setShowSignup(false)}
          />
        ) : (
          <LoginScreen
            isDarkMode={isDarkMode}
            onLogin={() => setShowSignup(false)}
            onSignup={() => setShowSignup(true)}
            onGuestLogin={() => setShowSignup(false)}
          />
        )}
      </View>
    );
  }

  // Đã đăng nhập, render navigation
  return <AppNavigator />;
}