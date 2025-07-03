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

const SignupScreen = ({ 
  isDarkMode = false,
  onSignup,
  onBackToLogin 
}) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const { register, loading, error, clearError } = useAuth();

  const validateForm = () => {
    if (!username.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập tên người dùng');
      return false;
    }
    
    if (!email.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập email');
      return false;
    }
    
    if (!email.includes('@')) {
      Alert.alert('Lỗi', 'Email không hợp lệ');
      return false;
    }
    
    if (password.length < 6) {
      Alert.alert('Lỗi', 'Mật khẩu phải có ít nhất 6 ký tự');
      return false;
    }
    
    if (password !== confirmPassword) {
      Alert.alert('Lỗi', 'Mật khẩu xác nhận không khớp');
      return false;
    }
    
    return true;
  };

  const handleSignup = async () => {
    if (!validateForm()) return;

    try {
      clearError();
      const response = await register({ username, email, password });
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
            <Icon name="user-plus" size={32} color="white" />
          </LinearGradient>
          
          <Text className={`text-2xl font-bold mb-2 ${
            isDarkMode ? 'text-white' : 'text-gray-800'
          }`}>
            Tạo tài khoản mới
          </Text>
          <Text className={`text-base text-center ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Đăng ký để bắt đầu theo dõi chi tiêu
          </Text>
        </View>

        {/* Signup Form */}
        <View className="space-y-4 mb-6">
          {/* Username Input */}
          <View>
            <Text className={`text-sm font-medium mb-2 ${
              isDarkMode ? 'text-white' : 'text-gray-700'
            }`}>
              Tên người dùng
            </Text>
            <View className={`flex-row items-center border rounded-lg px-3 py-3 ${
              isDarkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-300'
            }`}>
              <Icon 
                name="user" 
                size={16} 
                color={isDarkMode ? '#9ca3af' : '#6b7280'} 
                className="mr-3"
              />
              <TextInput
                value={username}
                onChangeText={setUsername}
                placeholder="Nhập tên người dùng"
                placeholderTextColor={isDarkMode ? '#9ca3af' : '#9ca3af'}
                className={`flex-1 text-base ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}
                autoCapitalize="words"
                autoCorrect={false}
              />
            </View>
          </View>

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
                placeholder="Nhập mật khẩu (ít nhất 6 ký tự)"
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

          {/* Confirm Password Input */}
          <View>
            <Text className={`text-sm font-medium mb-2 ${
              isDarkMode ? 'text-white' : 'text-gray-700'
            }`}>
              Xác nhận mật khẩu
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
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Nhập lại mật khẩu"
                placeholderTextColor={isDarkMode ? '#9ca3af' : '#9ca3af'}
                className={`flex-1 text-base ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}
                secureTextEntry={!showConfirmPassword}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                <Icon 
                  name={showConfirmPassword ? 'eye-slash' : 'eye'} 
                  size={16} 
                  color={isDarkMode ? '#9ca3af' : '#6b7280'} 
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Signup Button */}
        <TouchableOpacity
          onPress={handleSignup}
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
                Đăng ký
              </Text>
            )}
          </LinearGradient>
        </TouchableOpacity>

        {/* Back to Login Link */}
        <View className="flex-row justify-center">
          <Text className={`text-base ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Đã có tài khoản?{' '}
          </Text>
          <TouchableOpacity onPress={handleBackToLogin}>
            <Text className="text-blue-600 text-base font-semibold">
              Đăng nhập
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default SignupScreen;
