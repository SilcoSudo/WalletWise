import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert, ScrollView } from 'react-native';
import Toast from 'react-native-toast-message';
import { useAuth } from '../hooks/useAuth';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome5';
import LanguageSwitcher from '../components/LanguageSwitcher';
import { useTranslation } from 'react-i18next';

const SecurityScreen = ({ isDarkMode = false, navigation }) => {
  const { updatePassword, deleteUser } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Toast.show({ type: 'error', text1: 'Lỗi', text2: 'Vui lòng nhập đầy đủ thông tin.' });
      return;
    }
    if (newPassword !== confirmPassword) {
      Toast.show({ type: 'error', text1: 'Lỗi', text2: 'Mật khẩu xác nhận không khớp.' });
      return;
    }
    setLoading(true);
    try {
      await updatePassword(currentPassword, newPassword);
      Toast.show({ type: 'success', text1: 'Thành công', text2: 'Đổi mật khẩu thành công!' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      navigation.goBack && navigation.goBack();
    } catch (err) {
      Toast.show({ type: 'error', text1: 'Lỗi', text2: err.message || 'Đổi mật khẩu thất bại.' });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Xác nhận xóa tài khoản',
      'Bạn có chắc chắn muốn xóa tài khoản của mình? Hành động này không thể hoàn tác.',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xóa tài khoản',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteUser();
              Alert.alert('Thông báo', 'Tài khoản của bạn đã được xóa.');
              navigation?.navigate?.('settings');
            } catch (err) {
              Alert.alert('Lỗi', err.message || 'Không thể xóa tài khoản.');
            }
          },
        },
      ]
    );
  };

  return (
    <ScrollView className={`flex-1 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`} contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
      <View className="flex-1 justify-center px-6" style={{ paddingTop: 50 }}>
        <LanguageSwitcher isDarkMode={isDarkMode} />
        {/* Header */}
        <View className="items-center mb-8">
          <LinearGradient colors={['#667eea', '#764ba2']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} className="w-20 h-20 rounded-full items-center justify-center mb-4">
            <Icon name="shield-alt" size={32} color="white" />
          </LinearGradient>
          <Text className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{t('security.title')}</Text>
        </View>
        {/* Change Password Form */}
        <View className="space-y-4 mb-6">
          {/* Current Password */}
          <View>
            <Text className={`text-sm font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>{t('security.currentPassword')}</Text>
            <View className={`flex-row items-center border rounded-lg px-3 py-3 ${isDarkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-300'}`}>
              <Icon name="lock" size={16} color={isDarkMode ? '#9ca3af' : '#6b7280'} className="mr-3" />
              <TextInput value={currentPassword} onChangeText={setCurrentPassword} placeholder={t('security.currentPassword')} placeholderTextColor={isDarkMode ? '#9ca3af' : '#9ca3af'} className={`flex-1 text-base ${isDarkMode ? 'text-white' : 'text-gray-900'}`} secureTextEntry autoCapitalize="none" autoCorrect={false} />
            </View>
          </View>
          {/* New Password */}
          <View>
            <Text className={`text-sm font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>{t('security.newPassword')}</Text>
            <View className={`flex-row items-center border rounded-lg px-3 py-3 ${isDarkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-300'}`}>
              <Icon name="lock" size={16} color={isDarkMode ? '#9ca3af' : '#6b7280'} className="mr-3" />
              <TextInput value={newPassword} onChangeText={setNewPassword} placeholder={t('security.newPassword')} placeholderTextColor={isDarkMode ? '#9ca3af' : '#9ca3af'} className={`flex-1 text-base ${isDarkMode ? 'text-white' : 'text-gray-900'}`} secureTextEntry autoCapitalize="none" autoCorrect={false} />
            </View>
          </View>
          {/* Confirm New Password */}
          <View>
            <Text className={`text-sm font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>{t('security.confirmNewPassword')}</Text>
            <View className={`flex-row items-center border rounded-lg px-3 py-3 ${isDarkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-300'}`}>
              <Icon name="lock" size={16} color={isDarkMode ? '#9ca3af' : '#6b7280'} className="mr-3" />
              <TextInput value={confirmPassword} onChangeText={setConfirmPassword} placeholder={t('security.confirmNewPassword')} placeholderTextColor={isDarkMode ? '#9ca3af' : '#9ca3af'} className={`flex-1 text-base ${isDarkMode ? 'text-white' : 'text-gray-900'}`} secureTextEntry autoCapitalize="none" autoCorrect={false} />
            </View>
          </View>
        </View>
        {/* Change Password Button */}
        <TouchableOpacity onPress={handleChangePassword} className="bg-blue-600 rounded-lg py-4 items-center mb-3">
          <Text className="text-white text-lg font-semibold">{t('security.changePassword')}</Text>
        </TouchableOpacity>
        {/* Delete Account Button */}
        <TouchableOpacity onPress={handleDeleteAccount} className="mb-4">
          <LinearGradient colors={['#ef4444', '#b91c1c']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} className="rounded-lg py-4 items-center">
            <Text className="text-white text-lg font-semibold">{t('security.deleteAccount')}</Text>
          </LinearGradient>
        </TouchableOpacity>
        {/* Back Link */}
        <TouchableOpacity className="mt-6" onPress={() => navigation?.goBack?.()}>
          <Text className="text-blue-600">{t('security.back')}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default SecurityScreen;

