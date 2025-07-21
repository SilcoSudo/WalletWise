import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { authAPI } from '../utils/api';
import Toast from 'react-native-toast-message';

const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

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
    <View className="flex-1 justify-center items-center px-6 bg-white">
      <Text className="text-2xl font-bold mb-4">Quên mật khẩu</Text>
      <Text className="mb-6 text-center text-gray-600">
        Nhập email và mật khẩu mới để đổi mật khẩu.
      </Text>
      <TextInput
        className="w-full border border-gray-300 rounded-lg px-4 py-3 mb-3"
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
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
        onPress={handleForgotPassword}
        disabled={loading}
      >
        {loading ? <ActivityIndicator color="#fff" /> : <Text className="text-white font-semibold">Đổi mật khẩu</Text>}
      </TouchableOpacity>
      {success && (
        <View style={{ marginTop: 16, padding: 12, backgroundColor: '#e0f7fa', borderRadius: 8 }}>
          <Text style={{ color: '#00796b', textAlign: 'center' }}>
            {success}
          </Text>
          <Text style={{ color: '#00796b', textAlign: 'center', marginTop: 8 }}>
            Vui lòng kiểm tra email và bấm vào link xác thực để hoàn tất đổi mật khẩu.
          </Text>
        </View>
      )}
      {error && (
        <View style={{ marginTop: 16, padding: 12, backgroundColor: '#ffebee', borderRadius: 8 }}>
          <Text style={{ color: '#c62828', textAlign: 'center' }}>
            {error}
          </Text>
        </View>
      )}
      <TouchableOpacity className="mt-6" onPress={() => navigation?.goBack?.()}>
        <Text className="text-blue-600">Quay lại đăng nhập</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ForgotPasswordScreen; 