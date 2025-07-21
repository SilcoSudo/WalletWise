import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import VerifyEmailScreen from '../screens/VerifyEmailScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import ResetPasswordScreen from '../screens/ResetPasswordScreen';
// import ForgotPasswordScreen, ResetPasswordScreen sau

const Stack = createStackNavigator();

const AuthNavigator = ({ isDarkMode = false, onAuthSuccess }) => {
  return (
    <SafeAreaProvider>
      <NavigationContainer independent>
        <StatusBar
          barStyle={isDarkMode ? 'light-content' : 'dark-content'}
          backgroundColor={isDarkMode ? '#111827' : '#f9fafb'}
        />
        <Stack.Navigator
          initialRouteName="Login"
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="Login">
            {props => (
              <LoginScreen
                {...props}
                isDarkMode={isDarkMode}
                onLogin={onAuthSuccess}
                onSignup={() => props.navigation.navigate('Signup')}
                onGuestLogin={onAuthSuccess}
                onVerifyEmail={() => props.navigation.navigate('VerifyEmail')}
                onForgotPassword={() => props.navigation.navigate('ForgotPassword')}
                // sẽ thêm onForgotPassword sau
              />
            )}
          </Stack.Screen>
          <Stack.Screen name="Signup">
            {props => (
              <SignupScreen
                {...props}
                isDarkMode={isDarkMode}
                onSignup={onAuthSuccess}
                onBackToLogin={() => props.navigation.navigate('Login')}
              />
            )}
          </Stack.Screen>
          <Stack.Screen name="VerifyEmail" component={VerifyEmailScreen} />
          <Stack.Screen name="ForgotPassword">
            {props => (
              <ForgotPasswordScreen
                {...props}
                onResetPassword={() => props.navigation.navigate('ResetPassword')}
              />
            )}
          </Stack.Screen>
          <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
          {/* Thêm ForgotPasswordScreen, ResetPasswordScreen sau */}
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default AuthNavigator;
