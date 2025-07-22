//Truong Phu Quy
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  Alert,
  ActivityIndicator 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useAuth } from '../hooks/useAuth';
import LanguageSwitcher from '../components/LanguageSwitcher';
import { useTranslation } from 'react-i18next';

const LoginScreen = ({ 
  isDarkMode = false,
  onLogin,
  onSignup,
  onGuestLogin,
  onForgotPassword,
  onToggleDarkMode
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const { login, guestLogin, loading, error, clearError } = useAuth();
  const { t } = useTranslation();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert(t('error.loginFailed'), t('error.required'));
      return;
    }

    try {
      clearError();
      const response = await login({ email, password });
      console.log('Login successful:', response);
      onLogin && onLogin(response);
    } catch (err) {
      console.error('Login failed:', err);
      Alert.alert('Lỗi đăng nhập', err.message || 'Đăng nhập thất bại');
    }
  };

  const handleGuestLogin = async () => {
    try {
      clearError();
      const response = await guestLogin();
      console.log('Guest login successful:', response);
      onGuestLogin && onGuestLogin(response);
    } catch (err) {
      console.error('Guest login failed:', err);
      Alert.alert('Lỗi đăng nhập', err.message || 'Đăng nhập thất bại');
    }
  };

  const handleSignup = () => {
    onSignup && onSignup();
  };

  return (
    <ScrollView 
      className={`flex-1 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}
      contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
      showsVerticalScrollIndicator={false}
    >
      <View className="flex-1 justify-center px-6" style={{ paddingTop : 50}}>
        <View className="flex-row items-center justify-between mb-4">
          <TouchableOpacity onPress={onToggleDarkMode} className="mr-2 p-2">
            <Icon name={isDarkMode ? 'sun' : 'moon'} size={20} color={isDarkMode ? '#facc15' : '#2563eb'} />
          </TouchableOpacity>
          <LanguageSwitcher isDarkMode={isDarkMode} />
        </View>
        {/* Header */}
        <View className="items-center mb-8">
          <LinearGradient
            colors={isDarkMode ? ['#d7d2cc', '#304352'] : ['#a8edea', '#fed6e3']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="w-20 h-20 rounded-full items-center justify-center mb-4"
          >
            <Icon name="wallet" size={32} color="white" />
          </LinearGradient>
          <Text className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{t('login.title')}</Text>
          <Text className={`text-base text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{t('login.subtitle')}</Text>
        </View>
        {/* Login Form */}
        <View className="space-y-4 mb-6">
          {/* Email Input */}
          <View>
            <Text className={`text-sm font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>{t('login.email')}</Text>
            <View className={`flex-row items-center border rounded-lg px-3 py-3 ${isDarkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-300'}`}> 
              <Icon name="envelope" size={16} color={isDarkMode ? '#9ca3af' : '#6b7280'} className="mr-3" />
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder={t('login.email')}
                placeholderTextColor={isDarkMode ? '#9ca3af' : '#9ca3af'}
                className={`flex-1 text-base ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
          </View>
          {/* Password Input */}
          <View>
            <Text className={`text-sm font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>{t('login.password')}</Text>
            <View className={`flex-row items-center border rounded-lg px-3 py-3 ${isDarkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-300'}`}> 
              <Icon name="lock" size={16} color={isDarkMode ? '#9ca3af' : '#6b7280'} className="mr-3" />
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder={t('login.password')}
                placeholderTextColor={isDarkMode ? '#9ca3af' : '#9ca3af'}
                className={`flex-1 text-base ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Icon name={showPassword ? 'eye-slash' : 'eye'} size={16} color={isDarkMode ? '#9ca3af' : '#6b7280'} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        {/* Forgot Password */}
        <TouchableOpacity onPress={onForgotPassword} className="mb-4">
          <Text className="text-blue-600 text-right">{t('login.forgotPassword')}</Text>
        </TouchableOpacity>
        {/* Login Button */}
        <TouchableOpacity onPress={handleLogin} className="mb-3 rounded-lg overflow-hidden">
          <LinearGradient
            colors={isDarkMode ? ['#d7d2cc', '#304352'] : ['#a8edea', '#fed6e3']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="py-4 items-center"
          >
            <Text className="text-white text-lg font-semibold">{t('login.login')}</Text>
          </LinearGradient>
        </TouchableOpacity>
        {/* Guest Login Button */}
        <TouchableOpacity
          onPress={handleGuestLogin}
          className={`rounded-lg py-4 items-center mb-3 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}
        >
          <Text className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{t('login.guest')}</Text>
        </TouchableOpacity>
        {/* Signup Link */}
        <View className="flex-row justify-center mt-2">
          <Text className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>{t('login.noAccount')}</Text>
          <TouchableOpacity onPress={handleSignup}>
            <Text className="text-blue-600 ml-1 font-semibold">{t('login.signupNow')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default LoginScreen;
