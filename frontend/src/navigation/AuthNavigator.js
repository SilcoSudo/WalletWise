import React, { useState } from 'react';
import { View, StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';

const AuthNavigator = ({ 
  isDarkMode = false,
  onAuthSuccess 
}) => {
  const [showSignup, setShowSignup] = useState(false);

  const handleLogin = (response) => {
    console.log('AuthNavigator: Login successful, user:', response.user);
    onAuthSuccess && onAuthSuccess(response);
  };

  const handleSignup = (response) => {
    console.log('AuthNavigator: Signup successful, user:', response.user);
    onAuthSuccess && onAuthSuccess(response);
  };

  const handleGuestLogin = (response) => {
    console.log('AuthNavigator: Guest login successful, user:', response.user);
    onAuthSuccess && onAuthSuccess(response);
  };

  const handleGoToSignup = () => {
    console.log('AuthNavigator: Navigating to signup');
    setShowSignup(true);
  };

  const handleBackToLogin = () => {
    console.log('AuthNavigator: Navigating back to login');
    setShowSignup(false);
  };

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
            onBackToLogin={handleBackToLogin}
          />
        ) : (
          <LoginScreen
            isDarkMode={isDarkMode}
            onLogin={handleLogin}
            onSignup={handleGoToSignup}
            onGuestLogin={handleGuestLogin}
          />
        )}
      </View>
    </SafeAreaProvider>
  );
};

export default AuthNavigator;
