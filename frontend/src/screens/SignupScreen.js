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

const SignupScreen = ({
  isDarkMode = false,
  onSignup,
  onBackToLogin,
  onToggleDarkMode
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { register, loading, error, clearError } = useAuth();
  const { t } = useTranslation();

  const validateForm = () => {
    if (!name.trim()) {
      Alert.alert(t('error.signupFailed'), t('error.required'));
      return false;
    }

    if (!email.trim()) {
      Alert.alert(t('error.signupFailed'), t('error.required'));
      return false;
    }

    if (!email.includes('@')) {
      Alert.alert(t('error.signupFailed'), t('error.invalidEmail'));
      return false;
    }

    if (password.length < 6) {
      Alert.alert(t('error.signupFailed'), t('error.required'));
      return false;
    }

    if (password !== confirmPassword) {
      Alert.alert(t('error.signupFailed'), t('error.passwordMismatch'));
      return false;
    }

    return true;
  };

  const handleSignup = async () => {
    if (!validateForm()) return;

    try {
      clearError();
      const response = await register({ name, email, password });
      console.log('Signup successful:', response);
      onSignup && onSignup(response);
    } catch (err) {
      console.error('Signup failed:', err);
      Alert.alert('Lỗi đăng ký', err.message || 'Đăng ký thất bại');
    }
  };

  const handleBackToLogin = () => {
    onBackToLogin && onBackToLogin();
  };

  return (
    <ScrollView
      className={`flex-1 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}
      contentContainerStyle={{ flexGrow: 1, paddingBottom: 20}}
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
            <Icon name="user-plus" size={32} color="white" />
          </LinearGradient>
          <Text className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{t('signup.title')}</Text>
          <Text className={`text-base text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{t('signup.subtitle')}</Text>
        </View>
        {/* Signup Form */}
        <View className="space-y-4 mb-6">
          {/* Username Input */}
          <View>
            <Text className={`text-sm font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>{t('signup.username')}</Text>
            <View className={`flex-row items-center border rounded-lg px-3 py-3 ${isDarkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-300'}`}>
              <Icon name="user" size={16} color={isDarkMode ? '#9ca3af' : '#6b7280'} className="mr-3" />
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder={t('signup.username')}
                placeholderTextColor={isDarkMode ? '#9ca3af' : '#9ca3af'}
                className={`flex-1 text-base ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
                autoCapitalize="words"
                autoCorrect={false}
              />
            </View>
          </View>
          {/* Email Input */}
          <View>
            <Text className={`text-sm font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>{t('signup.email')}</Text>
            <View className={`flex-row items-center border rounded-lg px-3 py-3 ${isDarkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-300'}`}>
              <Icon name="envelope" size={16} color={isDarkMode ? '#9ca3af' : '#6b7280'} className="mr-3" />
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder={t('signup.email')}
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
            <Text className={`text-sm font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>{t('signup.password')}</Text>
            <View className={`flex-row items-center border rounded-lg px-3 py-3 ${isDarkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-300'}`}>
              <Icon name="lock" size={16} color={isDarkMode ? '#9ca3af' : '#6b7280'} className="mr-3" />
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder={t('signup.password')}
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
          {/* Confirm Password Input */}
          <View>
            <Text className={`text-sm font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>{t('signup.confirmPassword')}</Text>
            <View className={`flex-row items-center border rounded-lg px-3 py-3 ${isDarkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-300'}`}>
              <Icon name="lock" size={16} color={isDarkMode ? '#9ca3af' : '#6b7280'} className="mr-3" />
              <TextInput
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder={t('signup.confirmPassword')}
                placeholderTextColor={isDarkMode ? '#9ca3af' : '#9ca3af'}
                className={`flex-1 text-base ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
                secureTextEntry={!showConfirmPassword}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                <Icon name={showConfirmPassword ? 'eye-slash' : 'eye'} size={16} color={isDarkMode ? '#9ca3af' : '#6b7280'} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        {/* Signup Button */}
        <TouchableOpacity onPress={handleSignup} className="mb-3 rounded-lg overflow-hidden">
          <LinearGradient
            colors={isDarkMode ? ['#d7d2cc', '#304352'] : ['#a8edea', '#fed6e3']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="py-4 items-center"
          >
            <Text className="text-white text-lg font-semibold">{t('signup.signup')}</Text>
          </LinearGradient>
        </TouchableOpacity>
        {/* Back to Login Link */}
        <View className="flex-row justify-center mt-2">
          <Text className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>{t('signup.haveAccount')}</Text>
          <TouchableOpacity onPress={handleBackToLogin}>
            <Text className="text-blue-600 ml-1 font-semibold">{t('signup.login')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default SignupScreen;
