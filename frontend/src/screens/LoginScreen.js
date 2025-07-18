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

const LoginScreen = ({ 
  isDarkMode = false,
  onLogin,
  onSignup,
  onGuestLogin 
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const { login, guestLogin, loading, error, clearError } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin');
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
      contentContainerStyle={{ flexGrow: 1 }}
      showsVerticalScrollIndicator={false}
    >
      <View className="flex-1 justify-center px-6">
        {/* Header */}
        <View className="items-center mb-8">
          <LinearGradient
            colors={['#667eea', '#764ba2']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="w-20 h-20 rounded-full items-center justify-center mb-4"
          >
            <Icon name="wallet" size={32} color="white" />
          </LinearGradient>
          
          <Text className={`text-2xl font-bold mb-2 ${
            isDarkMode ? 'text-white' : 'text-gray-800'
          }`}>
            Chào mừng trở lại
          </Text>
          <Text className={`text-base text-center ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Đăng nhập để tiếp tục theo dõi chi tiêu
          </Text>
        </View>

        {/* Login Form */}
        <View className="space-y-4 mb-6">
          {/* Email Input */}
          <View>
            <Text className={`text-sm font-medium mb-2 ${
              isDarkMode ? 'text-white' : 'text-gray-700'
            }`}>
              Email
            </Text>
            <View className={`flex-row items-center border rounded-lg px-3 py-3 ${
              isDarkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-300'
            }`}>
              <Icon 
                name="envelope" 
                size={16} 
                color={isDarkMode ? '#9ca3af' : '#6b7280'} 
                className="mr-3"
              />
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="Nhập email của bạn"
                placeholderTextColor={isDarkMode ? '#9ca3af' : '#9ca3af'}
                className={`flex-1 text-base ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
          </View>

          {/* Password Input */}
          <View>
            <Text className={`text-sm font-medium mb-2 ${
              isDarkMode ? 'text-white' : 'text-gray-700'
            }`}>
              Mật khẩu
            </Text>
            <View className={`flex-row items-center border rounded-lg px-3 py-3 ${
              isDarkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-300'
            }`}>
              <Icon 
                name="lock" 
                size={16} 
                color={isDarkMode ? '#9ca3af' : '#6b7280'} 
                className="mr-3"
              />
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Nhập mật khẩu"
                placeholderTextColor={isDarkMode ? '#9ca3af' : '#9ca3af'}
                className={`flex-1 text-base ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Icon 
                  name={showPassword ? 'eye-slash' : 'eye'} 
                  size={16} 
                  color={isDarkMode ? '#9ca3af' : '#6b7280'} 
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Login Button */}
        <TouchableOpacity
          onPress={handleLogin}
          disabled={loading}
          className="mb-4"
        >
          <LinearGradient
            colors={['#667eea', '#764ba2']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="rounded-lg py-4 items-center"
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white text-lg font-semibold">
                Đăng nhập
              </Text>
            )}
          </LinearGradient>
        </TouchableOpacity>

        {/* Guest Login Button */}
        <TouchableOpacity
          onPress={handleGuestLogin}
          disabled={loading}
          className="mb-6"
        >
          <View className={`rounded-lg py-4 items-center border-2 ${
            isDarkMode ? 'border-gray-600 bg-gray-800' : 'border-gray-300 bg-white'
          }`}>
            <Text className={`text-lg font-semibold ${
              isDarkMode ? 'text-white' : 'text-gray-700'
            }`}>
              Đăng nhập với tài khoản khách
            </Text>
          </View>
        </TouchableOpacity>
        {/* Sign Up Link */}
        <View className="flex-row justify-center">
          <Text className={`text-base ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Chưa có tài khoản?{' '}
          </Text>
          <TouchableOpacity onPress={handleSignup}>
            <Text className="text-blue-600 text-base font-semibold">
              Đăng ký ngay
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default LoginScreen;
