import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import Toast from 'react-native-toast-message';
import { useAuth } from '../hooks/useAuth';

const SecurityScreen = ({ navigation }) => {
  const { updatePassword, deleteUser } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

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
    <View className="flex-1 justify-center items-center px-6 bg-white">
      <Text className="text-2xl font-bold mb-4">Đổi mật khẩu</Text>
      <TextInput
        className="w-full border border-gray-300 rounded-lg px-4 py-3 mb-3"
        placeholder="Mật khẩu hiện tại"
        value={currentPassword}
        onChangeText={setCurrentPassword}
        secureTextEntry
        autoCapitalize="none"
      />
      <TextInput
        className="w-full border border-gray-300 rounded-lg px-4 py-3 mb-3"
        placeholder="Mật khẩu mới"
        value={newPassword}
        onChangeText={setNewPassword}
        secureTextEntry
        autoCapitalize="none"
      />
      <TextInput
        className="w-full border border-gray-300 rounded-lg px-4 py-3 mb-3"
        placeholder="Xác nhận mật khẩu mới"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        autoCapitalize="none"
      />
      <TouchableOpacity
        className="w-full bg-blue-600 rounded-lg py-3 items-center mb-3"
        onPress={handleChangePassword}
        disabled={loading}
      >
        {loading ? <ActivityIndicator color="#fff" /> : <Text className="text-white font-semibold">Đổi mật khẩu</Text>}
      </TouchableOpacity>
      <TouchableOpacity
        onPress={handleDeleteAccount}
        className="w-full bg-red-500 rounded-lg py-3 items-center mb-3"
      >
        <Text className="text-white font-semibold">Xóa tài khoản</Text>
      </TouchableOpacity>
      <TouchableOpacity className="mt-6" onPress={() => navigation?.goBack?.()}>
        <Text className="text-blue-600">Quay lại</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SecurityScreen;

