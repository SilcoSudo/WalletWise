import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import * as Linking from 'expo-linking';
import { authAPI } from '../utils/api';
import { useTranslation } from 'react-i18next';

const ResetPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const { t } = useTranslation();

  // Tự động lấy token/email từ URL nếu có
  useEffect(() => {
    const getParamsFromUrl = async () => {
      const url = await Linking.getInitialURL();
      if (url) {
        const parsed = Linking.parse(url);
        if (parsed.queryParams?.token && parsed.queryParams?.email) {
          setToken(parsed.queryParams.token);
          setEmail(parsed.queryParams.email);
        }
      }
    };
    getParamsFromUrl();
  }, []);

  const handleResetPassword = async () => {
    if (!email || !token || !newPassword || !confirmPassword) {
      setError(t('resetPassword.error.incomplete'));
      return;
    }
    if (newPassword !== confirmPassword) {
      setError(t('resetPassword.error.passwordMismatch'));
      return;
    }
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      await authAPI.resetPassword({ email, token, newPassword });
      setSuccess(t('resetPassword.success'));
    } catch (err) {
      setError(err.message || t('resetPassword.error.resetFailed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 justify-center items-center px-6 bg-white">
      <Text className="text-2xl font-bold mb-4">{t('resetPassword.title')}</Text>
      <Text className="mb-6 text-center text-gray-600">
        {t('resetPassword.description')}
      </Text>
      <TextInput
        className="w-full border border-gray-300 rounded-lg px-4 py-3 mb-3"
        placeholder={t('resetPassword.emailPlaceholder')}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        className="w-full border border-gray-300 rounded-lg px-4 py-3 mb-3"
        placeholder={t('resetPassword.tokenPlaceholder')}
        value={token}
        onChangeText={setToken}
        autoCapitalize="none"
      />
      <TextInput
        className="w-full border border-gray-300 rounded-lg px-4 py-3 mb-3"
        placeholder={t('resetPassword.newPasswordPlaceholder')}
        value={newPassword}
        onChangeText={setNewPassword}
        secureTextEntry
        autoCapitalize="none"
      />
      <TextInput
        className="w-full border border-gray-300 rounded-lg px-4 py-3 mb-3"
        placeholder={t('resetPassword.confirmNewPasswordPlaceholder')}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        autoCapitalize="none"
      />
      <TouchableOpacity
        className="w-full bg-blue-600 rounded-lg py-3 items-center mb-3"
        onPress={handleResetPassword}
        disabled={loading}
      >
        {loading ? <ActivityIndicator color="#fff" /> : <Text className="text-white font-semibold">{t('resetPassword.reset')}</Text>}
      </TouchableOpacity>
      {success && <Text className="text-green-600 mt-2">{success}</Text>}
      {error && <Text className="text-red-600 mt-2">{error}</Text>}
      <TouchableOpacity className="mt-6" onPress={() => navigation?.goBack?.()}>
        <Text className="text-blue-600">{t('resetPassword.backToLogin')}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ResetPasswordScreen; 