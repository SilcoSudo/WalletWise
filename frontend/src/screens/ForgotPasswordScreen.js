import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { authAPI } from '../utils/api';
import Toast from 'react-native-toast-message';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome5';
import LanguageSwitcher from '../components/LanguageSwitcher';
import { useTranslation } from 'react-i18next';

const ForgotPasswordScreen = ({ navigation, isDarkMode = false, onToggleDarkMode }) => {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const { t } = useTranslation();

  const handleForgotPassword = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    if (!email || !newPassword || !confirmPassword) {
      Toast.show({
        type: 'error',
        text1: 'Lỗi',
        text2: 'Vui lòng nhập đầy đủ thông tin.'
      });
      setLoading(false);
      return;
    }
    if (newPassword !== confirmPassword) {
      Toast.show({
        type: 'error',
        text1: 'Lỗi',
        text2: 'Mật khẩu xác nhận không khớp.'
      });
      setLoading(false);
      return;
    }
    try {
      await authAPI.forgotPassword({ email, newPassword });
      Toast.show({
        type: 'success',
        text1: 'Thành công',
        text2: 'Đã gửi email xác thực. Vui lòng kiểm tra hộp thư để xác nhận đổi mật khẩu.'
      });
      setSuccess('Đã gửi email xác thực. Vui lòng kiểm tra hộp thư để xác nhận đổi mật khẩu.');
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: 'Lỗi',
        text2: err.message || 'Gửi email xác thực thất bại.'
      });
      setError(err.message || 'Gửi email xác thực thất bại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView className={`flex-1 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`} contentContainerStyle={{ flexGrow: 1, paddingBottom: 20, paddingTop: 50 }} showsVerticalScrollIndicator={false}>
      <View className="flex-1 justify-center px-6">
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
            <Icon name="lock" size={32} color="white" />
          </LinearGradient>
          <Text className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{t('forgotPassword.title')}</Text>
          <Text className={`text-base text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{t('forgotPassword.subtitle')}</Text>
        </View>
        {/* Form */}
        <View className="space-y-4 mb-6">
          <View>
            <Text className={`text-sm font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>{t('forgotPassword.email')}</Text>
            <View className={`flex-row items-center border rounded-lg px-3 py-3 ${isDarkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-300'}`}>
              <Icon name="envelope" size={16} color={isDarkMode ? '#9ca3af' : '#6b7280'} className="mr-3" />
              <TextInput value={email} onChangeText={setEmail} placeholder={t('forgotPassword.email')} placeholderTextColor={isDarkMode ? '#9ca3af' : '#9ca3af'} className={`flex-1 text-base ${isDarkMode ? 'text-white' : 'text-gray-900'}`} keyboardType="email-address" autoCapitalize="none" autoCorrect={false} />
            </View>
          </View>
          <View>
            <Text className={`text-sm font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>{t('forgotPassword.newPassword')}</Text>
            <View className={`flex-row items-center border rounded-lg px-3 py-3 ${isDarkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-300'}`}>
              <Icon name="lock" size={16} color={isDarkMode ? '#9ca3af' : '#6b7280'} className="mr-3" />
              <TextInput value={newPassword} onChangeText={setNewPassword} placeholder={t('forgotPassword.newPassword')} placeholderTextColor={isDarkMode ? '#9ca3af' : '#9ca3af'} className={`flex-1 text-base ${isDarkMode ? 'text-white' : 'text-gray-900'}`} secureTextEntry autoCapitalize="none" autoCorrect={false} />
            </View>
          </View>
          <View>
            <Text className={`text-sm font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>{t('forgotPassword.confirmNewPassword')}</Text>
            <View className={`flex-row items-center border rounded-lg px-3 py-3 ${isDarkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-300'}`}>
              <Icon name="lock" size={16} color={isDarkMode ? '#9ca3af' : '#6b7280'} className="mr-3" />
              <TextInput value={confirmPassword} onChangeText={setConfirmPassword} placeholder={t('forgotPassword.confirmNewPassword')} placeholderTextColor={isDarkMode ? '#9ca3af' : '#9ca3af'} className={`flex-1 text-base ${isDarkMode ? 'text-white' : 'text-gray-900'}`} secureTextEntry autoCapitalize="none" autoCorrect={false} />
            </View>
          </View>
        </View>
        {/* Đổi mật khẩu Button */}
        <TouchableOpacity onPress={handleForgotPassword} disabled={loading} className="mb-4 rounded-lg overflow-hidden">
          <LinearGradient colors={isDarkMode ? ['#d7d2cc', '#304352'] : ['#a8edea', '#fed6e3']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} className="py-4 items-center">
            {loading ? <ActivityIndicator color="white" /> : <Text className="text-white text-lg font-semibold">{t('forgotPassword.reset')}</Text>}
          </LinearGradient>
        </TouchableOpacity>
        {/* Success/Error */}
        {success && (
          <View style={{ marginTop: 16, padding: 12, backgroundColor: '#e0f7fa', borderRadius: 8 }}>
            <Text style={{ color: '#00796b', textAlign: 'center' }}>{success}</Text>
            <Text style={{ color: '#00796b', textAlign: 'center', marginTop: 8 }}>{t('forgotPassword.successMessage')}</Text>
          </View>
        )}
        {error && (
          <View style={{ marginTop: 16, padding: 12, backgroundColor: '#ffebee', borderRadius: 8 }}>
            <Text style={{ color: '#c62828', textAlign: 'center' }}>{error}</Text>
          </View>
        )}
        {/* Back to Login Link */}
        <TouchableOpacity className="mt-6" onPress={() => navigation?.goBack?.()}>
          <Text className="text-blue-600">{t('forgotPassword.backToLogin')}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default ForgotPasswordScreen; 