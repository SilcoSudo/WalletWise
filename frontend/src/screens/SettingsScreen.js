import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, Switch, Modal, TextInput, Alert } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";
import { LinearGradient } from "expo-linear-gradient";
import { useAuth } from "../hooks/useAuth";
import { useTranslation } from 'react-i18next';
import AvatarPicker from "../components/AvatarPicker";
 
 const SettingsScreen = ({ isDarkMode = false, onToggleDarkMode, onLogout, navigation }) => {
   const { t, i18n } = useTranslation();
   const { user, updateUser, deleteUser, updatePassword, updateLanguage, updateNotificationSettings, refreshUserData } = useAuth();

  // States for modals
  const [isProfileModalVisible, setIsProfileModalVisible] = useState(false);
  const [isSecurityModalVisible, setIsSecurityModalVisible] = useState(false);
  const [isNotificationModalVisible, setIsNotificationModalVisible] = useState(false);
  const [isLanguageModalVisible, setIsLanguageModalVisible] = useState(false);

  // States for user input
  const [name, setName] = useState(user?.name || user?.username || "");
  const [newEmail, setNewEmail] = useState(user?.email);
  const [avatar, setAvatar] = useState(user?.avatar || null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(true);  // State for notifications

  const [language, setLanguage] = useState(i18n.language);  // State for language selection

  // Initialize settings from user data
  useEffect(() => {
    if (user?.language) {
      setLanguage(user.language);
      i18n.changeLanguage(user.language);
    }
    if (user?.notifications?.enabled !== undefined) {
      setIsNotificationsEnabled(user.notifications.enabled);
    }
    setName(user?.name || user?.username || "");
    setAvatar(user?.avatar || null);
  }, [user]);

  // Refresh user data when component mounts
  useEffect(() => {
    refreshUserData();
  }, [refreshUserData]);
  const settingsSections = [
    {
      title: t('settings.account'),
      items: [
        { icon: "user", label: t('settings.profile'), action: "profile" },
        { icon: "shield-alt", label: t('settings.security'), action: "security" },
        // { icon: "bell", label: t('settings.notifications'), action: "notifications" },  // Added notifications section
      ],
    },
    {
      title: t('settings.application'),
      items: [
        { icon: "palette", label: t('settings.theme'), action: "theme" },
        { icon: "language", label: t('settings.language'), action: "language" },
      ],
    },
    {
      title: t('settings.dataManagement'),
      items: [
        // { icon: "download", label: "Xuất dữ liệu", action: "export", iconColor: "#10b981", bgColor: "bg-green-100" },
        // { icon: "upload", label: "Nhập dữ liệu", action: "import", iconColor: "#3b82f6", bgColor: "bg-blue-100" },
        { icon: "file-alt", label: "Báo cáo", action: "reports", iconColor: "#2563eb", bgColor: "bg-blue-100" },
        { icon: "trash-alt", label: "Xóa tất cả dữ liệu", action: "delete", iconColor: "#ef4444", bgColor: "bg-red-100" },
      ],
    },
    {
      title: t('settings.support'),
      items: [
        { icon: "question-circle", label: t('settings.help'), action: "help" },
        { icon: "envelope", label: t('settings.contact'), action: "contact" },
        { icon: "star", label: t('settings.rate'), action: "rate" },
      ],
    },
  ];

  const handleSettingPress = (action) => {
    switch (action) {
      case 'profile':
        setIsProfileModalVisible(true);  // Show Profile modal
        break;
      case 'security':
        navigation.navigate && navigation.navigate('security'); // Điều hướng sang màn hình SecurityScreen (chữ thường)
        break;
      case 'notifications':
        setIsNotificationModalVisible(true);  // Show Notification modal
        break;
       case "language": // Khi người dùng chọn "Ngôn ngữ"
      setIsLanguageModalVisible(true);  // Mở modal ngôn ngữ
      break;
      case "reports":
        navigation.navigate && navigation.navigate("reports");
        break;
      default:
        break;
    }
  };

  const handleSaveProfile = () => {
    if (name === "" || newEmail === "") {
      Alert.alert("Thông báo", "Vui lòng điền đầy đủ thông tin.");
      return;
    }
    // Gửi avatar nếu có
    updateUser({ name, email: newEmail, avatar });
    setIsProfileModalVisible(false);  // Close Profile modal
  };

  // Callback khi chọn avatar mới
  const handleAvatarChange = async (newAvatarUrl) => {
    setAvatar(newAvatarUrl);
    try {
      // Tự động lưu avatar mới lên backend
      await updateUser({ avatar: newAvatarUrl });
    } catch (error) {
      console.error('Error saving avatar:', error);
      // Revert avatar if save fails
      setAvatar(user?.avatar || null);
      Alert.alert("Lỗi", "Không thể lưu ảnh đại diện. Vui lòng thử lại.");
    }
  };

  const handleSavePassword = async () => {
    if (currentPassword === "" || newPassword === "") {
      Alert.alert("Thông báo", "Vui lòng điền đầy đủ mật khẩu.");
      return;
    }

    try {
      await updatePassword(currentPassword, newPassword);
      Alert.alert("Thông báo", "Mật khẩu đã được thay đổi.");
      setCurrentPassword("");
      setNewPassword("");
      setIsSecurityModalVisible(false);
    } catch (error) {
      Alert.alert("Lỗi", error.message || "Không thể thay đổi mật khẩu.");
    }
  };

  const handleToggleNotifications = async () => {
    const newValue = !isNotificationsEnabled;
    setIsNotificationsEnabled(newValue);
    
    try {
      await updateNotificationSettings(newValue);
    } catch (error) {
      // Revert the state if API call fails
      setIsNotificationsEnabled(!newValue);
      Alert.alert("Lỗi", "Không thể cập nhật cài đặt thông báo.");
    }
  };

  return (
    <ScrollView
      className={`flex-1 ${isDarkMode ? "bg-gray-900" : "bg-gray-50"}`}
      showsVerticalScrollIndicator={false}
    >
      {/* Profile Section */}
      <View className="p-4">
        <LinearGradient
          colors={isDarkMode ? ["#d7d2cc", "#304352"] : ["#a8edea", "#fed6e3"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="rounded-lg p-4 shadow-sm"
        >
          <Text className="text-lg font-semibold mb-4 text-gray-800">
            {t('settings.account')}
          </Text>
          <View className="flex-row items-center mb-4">
            {/* Avatar Picker */}
            <View className="mr-4">
              <AvatarPicker
                currentAvatar={avatar}
                onAvatarChange={handleAvatarChange}
                isDarkMode={isDarkMode}
              />
            </View>
            <View>
              <Text className="font-medium text-gray-800">
                {name || 'Người dùng'}
              </Text>
              <Text className="text-sm text-gray-600">
                {user?.email || 'email@example.com'}
              </Text>
            </View>
          </View>

          <TouchableOpacity 
            onPress={() => setIsProfileModalVisible(true)}
            className="border border-white/50 rounded-lg p-3 flex-row items-center justify-center bg-white/30"
          >
            <Icon name="user-edit" size={16} color="#6b7280" />
            <Text className="ml-2 text-gray-700">{t('settings.editProfile')}</Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>

      {/* Settings Sections */}
      {settingsSections.map((section, sectionIndex) => (
        <View key={sectionIndex} className="mb-6">
          <Text
            className={`text-sm font-medium text-gray-500 px-4 mb-2 ${
              isDarkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            {section.title}
          </Text>

          <View
            className={`mx-4 rounded-lg overflow-hidden ${
              isDarkMode ? "bg-gray-800" : "bg-white"
            } shadow-sm`}
          >
            {section.items.map((item, itemIndex) => (
              <TouchableOpacity
                key={itemIndex}
                onPress={() => handleSettingPress(item.action)}
                className={`flex-row items-center justify-between p-4 ${
                  itemIndex !== section.items.length - 1 
                    ? `border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-100'}` 
                    : ''
                }`}
              >
                <View className="flex-row items-center">
                  <View className={`w-8 h-8 rounded-full ${
                    item.bgColor || (item.action === 'theme' ? 'bg-blue-100' : 'bg-gray-100')
                  } items-center justify-center mr-3`}>
                    <Icon 
                      name={item.icon} 
                      size={14} 
                      color={item.iconColor || (item.action === 'theme' ? '#2563eb' : '#6b7280')} 
                    />
                  </View>
                  <Text className={`${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                    {item.label}
                  </Text>
                </View>
                
                {item.action === 'theme' ? (
                  <Switch
                    value={isDarkMode}
                    onValueChange={onToggleDarkMode}
                    trackColor={{ false: '#d1d5db', true: '#3b82f6' }}
                    thumbColor={isDarkMode ? '#ffffff' : '#ffffff'}
                  />
                ) : (
                  <Icon name="chevron-right" size={14} color={isDarkMode ? '#9ca3af' : '#6b7280'} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ))}

      {/* Logout Button */}
      <View className="px-4 mb-20">
        <TouchableOpacity
          onPress={onLogout}
          className={`p-4 rounded-lg ${
            isDarkMode ? "bg-red-900" : "bg-red-50"
          } shadow-sm`}
        >
          <View className="flex-row items-center justify-center">
            <Icon name="sign-out-alt" size={16} color="#dc2626" />
            <Text className="text-red-600 font-medium ml-2">{t('settings.logout')}</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* App Version */}
      <View className="items-center pb-4">
        <Text
          className={`text-xs ${
            isDarkMode ? "text-gray-500" : "text-gray-400"
          }`}
        >
          {t('settings.version')}
        </Text>
      </View>

      {/* Profile Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isProfileModalVisible}
        onRequestClose={() => setIsProfileModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className={`w-11/12 rounded-lg p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <Text className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
              {t('settings.editProfileTitle')}
            </Text>
            
            {/* Avatar Picker trong modal chỉnh sửa hồ sơ */}
            <View className="items-center mb-4">
              <AvatarPicker
                currentAvatar={avatar}
                onAvatarChange={handleAvatarChange}
                isDarkMode={isDarkMode}
              />
            </View>
            <View className="mb-4">
              <Text className={`text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {t('settings.username')}
              </Text>
              <TextInput
                value={name}
                onChangeText={setName}
                className={`border rounded-lg p-3 ${
                  isDarkMode 
                    ? 'border-gray-600 bg-gray-700 text-white' 
                    : 'border-gray-300 bg-white text-gray-800'
                }`}
                placeholder="Nhập tên người dùng"
                placeholderTextColor={isDarkMode ? '#9ca3af' : '#6b7280'}
              />
            </View>
            
            <View className="mb-6">
              <Text className={`text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {t('settings.email')}
              </Text>
              <TextInput
                value={newEmail}
                onChangeText={setNewEmail}
                className={`border rounded-lg p-3 ${
                  isDarkMode 
                    ? 'border-gray-600 bg-gray-700 text-white' 
                    : 'border-gray-300 bg-white text-gray-800'
                }`}
                placeholder="Nhập email"
                placeholderTextColor={isDarkMode ? '#9ca3af' : '#6b7280'}
                keyboardType="email-address"
              />
            </View>
            
            <View className="flex-row justify-end space-x-3">
              <TouchableOpacity
                onPress={() => setIsProfileModalVisible(false)}
                className={`px-4 py-2 rounded-lg ${isDarkMode ? 'bg-gray-600' : 'bg-gray-200'}`}
              >
                <Text className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{t('settings.cancel')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSaveProfile}
                className="px-4 py-2 bg-blue-600 rounded-lg"
              >
                <Text className="text-white">{t('settings.save')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Security Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isSecurityModalVisible}
        onRequestClose={() => setIsSecurityModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className={`w-11/12 rounded-lg p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <Text className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
              {t('settings.securityTitle')}
            </Text>
            
            <View className="mb-4">
              <Text className={`text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {t('settings.currentPassword')}
              </Text>
              <TextInput
                value={currentPassword}
                onChangeText={setCurrentPassword}
                className={`border rounded-lg p-3 ${
                  isDarkMode 
                    ? 'border-gray-600 bg-gray-700 text-white' 
                    : 'border-gray-300 bg-white text-gray-800'
                }`}
                placeholder="Nhập mật khẩu hiện tại"
                placeholderTextColor={isDarkMode ? '#9ca3af' : '#6b7280'}
                secureTextEntry
              />
            </View>
            
            <View className="mb-4">
              <Text className={`text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {t('settings.newPassword')}
              </Text>
              <TextInput
                value={newPassword}
                onChangeText={setNewPassword}
                className={`border rounded-lg p-3 ${
                  isDarkMode 
                    ? 'border-gray-600 bg-gray-700 text-white' 
                    : 'border-gray-300 bg-white text-gray-800'
                }`}
                placeholder="Nhập mật khẩu mới"
                placeholderTextColor={isDarkMode ? '#9ca3af' : '#6b7280'}
                secureTextEntry
              />
            </View>
            
            <View className="flex-row justify-end space-x-3">
              <TouchableOpacity
                onPress={() => setIsSecurityModalVisible(false)}
                className={`px-4 py-2 rounded-lg ${isDarkMode ? 'bg-gray-600' : 'bg-gray-200'}`}
              >
                <Text className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{t('settings.cancel')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSavePassword}
                className="px-4 py-2 bg-blue-600 rounded-lg"
              >
                <Text className="text-white">{t('settings.changePassword')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Notification Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isNotificationModalVisible}
        onRequestClose={() => setIsNotificationModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className={`w-11/12 rounded-lg p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <Text className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
              {t('settings.notificationSettings')}
            </Text>
            
            <View className="space-y-4">
              <View className="flex-row items-center justify-between py-2">
                <Text className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {t('settings.pushNotifications')}
                </Text>
                <Switch
                  value={isNotificationsEnabled}
                  onValueChange={handleToggleNotifications}
                  trackColor={{ false: '#d1d5db', true: '#3b82f6' }}
                  thumbColor={isNotificationsEnabled ? '#ffffff' : '#ffffff'}
                />
              </View>
              
              <View className="flex-row items-center justify-between py-2">
                <Text className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {t('settings.emailNotifications')}
                </Text>
                <Switch
                  value={true}
                  onValueChange={() => {}}
                  trackColor={{ false: '#d1d5db', true: '#3b82f6' }}
                  thumbColor={'#ffffff'}
                />
              </View>
              
              <View className="flex-row items-center justify-between py-2">
                <Text className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {t('settings.transactionAlerts')}
                </Text>
                <Switch
                  value={true}
                  onValueChange={() => {}}
                  trackColor={{ false: '#d1d5db', true: '#3b82f6' }}
                  thumbColor={'#ffffff'}
                />
              </View>
              
              <View className="flex-row items-center justify-between py-2">
                <Text className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {t('settings.budgetAlerts')}
                </Text>
                <Switch
                  value={true}
                  onValueChange={() => {}}
                  trackColor={{ false: '#d1d5db', true: '#3b82f6' }}
                  thumbColor={'#ffffff'}
                />
              </View>
            </View>
            
            <View className="flex-row justify-end mt-6">
              <TouchableOpacity
                onPress={() => setIsNotificationModalVisible(false)}
                className="px-4 py-2 bg-blue-600 rounded-lg"
              >
                <Text className="text-white">{t('settings.close')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Language Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isLanguageModalVisible}
        onRequestClose={() => setIsLanguageModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className={`w-11/12 rounded-lg p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <Text className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
              {t('settings.selectLanguage')}
            </Text>
            
            <View className="space-y-2">
              {[
                { code: 'vi', name: t('settings.vietnamese'), flag: '🇻🇳' },
                { code: 'en', name: t('settings.english'), flag: '🇺🇸' },
              ].map((lang) => (
                <TouchableOpacity
                  key={lang.code}
                  onPress={async () => {
                    try {
                      await updateLanguage(lang.code);
                      setLanguage(lang.code);
                      Alert.alert(t('settings.notification'), t('settings.languageChanged', { lang: lang.name }));
                    } catch (error) {
                      Alert.alert(t('settings.error'), t('settings.languageChangeError'));
                    }
                  }}
                  className={`flex-row items-center justify-between p-3 rounded-lg ${
                    language === lang.code 
                      ? 'bg-blue-50 border border-blue-200' 
                      : isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                  }`}
                >
                  <View className="flex-row items-center">
                    <Text className="text-lg mr-3">{lang.flag}</Text>
                    <Text className={`${
                      language === lang.code 
                        ? 'text-blue-600 font-medium' 
                        : isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      {lang.name}
                    </Text>
                  </View>
                  {language === lang.code && (
                    <Icon name="check" size={16} color="#2563eb" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
            
            <View className="flex-row justify-end mt-6">
              <TouchableOpacity
                onPress={() => setIsLanguageModalVisible(false)}
                className="px-4 py-2 bg-blue-600 rounded-lg"
              >
                <Text className="text-white">{t('settings.close')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default SettingsScreen;
