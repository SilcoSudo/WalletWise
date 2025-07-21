//LeTrieuAn
import React, { useState, useEffect } from "react";         // React core + hooks for state and lifecycle
import { 
  View, Text, ScrollView, TouchableOpacity, Switch, 
  Modal, TextInput, Alert 
} from "react-native";                                       // Core RN components
import Icon from "react-native-vector-icons/FontAwesome5";   // Icon component
import { LinearGradient } from "expo-linear-gradient";       // Background gradient
import { useAuth } from "../hooks/useAuth";                 // Custom auth hook (login/logout/update)
import { useTranslation } from 'react-i18next';             // i18n hook for translations
import AvatarPicker from "../components/AvatarPicker";       // Avatar upload/picker component

const SettingsScreen = ({                                  
  isDarkMode = false,        // Prop: current theme mode
  onToggleDarkMode,          // Prop: callback to switch theme
  onLogout,                  // Prop: callback to log out
  navigation                 // Prop: navigation object
}) => {
  const { t, i18n } = useTranslation();                   // Translation fn + i18n instance
  const {
    user,                      // Current user profile
    updateUser,                // fn to update profile
    deleteUser,                // fn to delete account
    updatePassword,            // fn to change password
    updateLanguage,            // fn to change language
    updateNotificationSettings,// fn to toggle notifications
    refreshUserData            // fn to reload user data from server
  } = useAuth();

  // --- Modal visibility state ---
  const [isProfileModalVisible, setIsProfileModalVisible]     = useState(false);
  const [isSecurityModalVisible, setIsSecurityModalVisible]   = useState(false);
  const [isNotificationModalVisible, setIsNotificationModalVisible] = useState(false);
  const [isLanguageModalVisible, setIsLanguageModalVisible]   = useState(false);

  // --- Form fields state ---
  const [name, setName]                   = useState(user?.name || user?.username || "");
  const [newEmail, setNewEmail]           = useState(user?.email);
  const [avatar, setAvatar]               = useState(user?.avatar || null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword]     = useState("");
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(true);
  const [language, setLanguage]           = useState(i18n.language);

  // On user data change: initialize form fields and i18n settings
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

  // On mount: fetch latest user data
  useEffect(() => {
    refreshUserData();
  }, [refreshUserData]);

  // Define sections and items in the Settings menu
  const settingsSections = [
    {
      title: t('settings.account'),
      items: [
        { icon: "user",       label: t('settings.profile'),       action: "profile" },
        { icon: "shield-alt", label: t('settings.security'),      action: "security" },
        { icon: "bell",       label: t('settings.notifications'), action: "notifications" },
      ],
    },
    {
      title: t('settings.application'),
      items: [
        { icon: "palette",  label: t('settings.theme'),    action: "theme" },
        { icon: "language", label: t('settings.language'), action: "language" },
      ],
    },
    {
      title: t('settings.dataManagement'),
      items: [
        { icon: "download", label: "Xuất dữ liệu",        action: "export", iconColor: "#10b981" },
        { icon: "upload",   label: "Nhập dữ liệu",        action: "import", iconColor: "#3b82f6" },
        { icon: "file-alt", label: "Báo cáo",             action: "reports", iconColor: "#2563eb" },
        { icon: "trash-alt",label: "Xóa tất cả dữ liệu",  action: "delete", iconColor: "#ef4444" },
      ],
    },
    {
      title: t('settings.support'),
      items: [
        { icon: "question-circle", label: t('settings.help'),    action: "help" },
        { icon: "envelope",        label: t('settings.contact'), action: "contact" },
        { icon: "star",            label: t('settings.rate'),    action: "rate" },
      ],
    },
  ];

  // Handle taps on settings items
  const handleSettingPress = (action) => {
    switch (action) {
      case 'profile':       setIsProfileModalVisible(true);    break;
      case 'security':      setIsSecurityModalVisible(true);   break;
      case 'notifications': setIsNotificationModalVisible(true); break;
      case 'language':      setIsLanguageModalVisible(true);   break;
      case 'reports':       navigation.navigate && navigation.navigate("reports"); break;
      default: break;
    }
  };

  // Save profile changes
  const handleSaveProfile = () => {
    if (!name || !newEmail) {
      return Alert.alert("Thông báo", "Vui lòng điền đầy đủ thông tin.");
    }
    updateUser({ name, email: newEmail, avatar });  // Call updateUser()
    setIsProfileModalVisible(false);
  };

  // Callback when avatar is picked
  const handleAvatarChange = async (newAvatarUrl) => {
    setAvatar(newAvatarUrl);
    try {
      await updateUser({ avatar: newAvatarUrl });
    } catch {
      setAvatar(user?.avatar || null);
      Alert.alert("Lỗi", "Không thể lưu ảnh đại diện.");
    }
  };

  // Save new password
  const handleSavePassword = async () => {
    if (!currentPassword || !newPassword) {
      return Alert.alert("Thông báo", "Vui lòng điền đầy đủ mật khẩu.");
    }
    try {
      await updatePassword(currentPassword, newPassword);
      Alert.alert("Thông báo", "Mật khẩu đã được thay đổi.");
      setCurrentPassword(""); setNewPassword("");
      setIsSecurityModalVisible(false);
    } catch (err) {
      Alert.alert("Lỗi", err.message || "Không thể thay đổi mật khẩu.");
    }
  };

  // Delete account with confirmation
  const handleDeleteAccount = () => {
    Alert.alert(
      "Xác nhận xóa tài khoản",
      "Bạn có chắc chắn muốn xóa tài khoản? Hành động không thể hoàn tác.",
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Xóa tài khoản",
          style: "destructive",
          onPress: () => {
            deleteUser(user?.id);
            Alert.alert("Thông báo", "Tài khoản đã được xóa.");
            onLogout();
          }
        }
      ]
    );
  };

  // Toggle push notifications setting
  const handleToggleNotifications = async () => {
    const newValue = !isNotificationsEnabled;
    setIsNotificationsEnabled(newValue);
    try {
      await updateNotificationSettings(newValue);
    } catch {
      setIsNotificationsEnabled(!newValue);
      Alert.alert("Lỗi", "Không thể cập nhật thông báo.");
    }
  };

  // === RENDER ===
  return (
    <ScrollView className={`flex-1 ${isDarkMode ? "bg-gray-900" : "bg-gray-50"}`}>

      {/* Profile summary with gradient */}
      <View className="p-4">
        <LinearGradient
          colors={isDarkMode ? ["#d7d2cc", "#304352"] : ["#a8edea", "#fed6e3"]}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
          className="rounded-lg p-4 shadow-sm"
        >
          <Text className="text-lg font-semibold mb-4 text-gray-800">
            {t('settings.account')}
          </Text>
          <View className="flex-row items-center mb-4">
            <AvatarPicker currentAvatar={avatar} onAvatarChange={handleAvatarChange} isDarkMode={isDarkMode}/>
            <View>
              <Text className="font-medium text-gray-800">{name || 'Người dùng'}</Text>
              <Text className="text-sm text-gray-600">{user?.email}</Text>
            </View>
          </View>
          <TouchableOpacity onPress={() => setIsProfileModalVisible(true)} className="border rounded-lg p-3 bg-white/30 flex-row items-center justify-center">
            <Icon name="user-edit" size={16} color="#6b7280" />
            <Text className="ml-2 text-gray-700">{t('settings.editProfile')}</Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>

      {/* Loop through each settings section */}
      {settingsSections.map((section, si) => (
        <View key={si} className="mb-6">
          <Text className={`px-4 mb-2 text-sm font-medium ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
            {section.title}
          </Text>
          <View className={`mx-4 rounded-lg overflow-hidden ${isDarkMode ? "bg-gray-800" : "bg-white"} shadow-sm`}>
            {section.items.map((item, ii) => (
              <TouchableOpacity
                key={ii}
                onPress={() => handleSettingPress(item.action)}
                className={`flex-row items-center justify-between p-4 ${ii < section.items.length-1 ? (isDarkMode ? "border-gray-700" : "border-gray-100")+" border-b" : ""}`}
              >
                <View className="flex-row items-center">
                  <View className={`w-8 h-8 rounded-full ${item.bgColor||"bg-gray-100"} items-center justify-center mr-3`}>
                    <Icon name={item.icon} size={14} color={item.iconColor||"#6b7280"} />
                  </View>
                  <Text className={isDarkMode ? "text-white" : "text-gray-800"}>{item.label}</Text>
                </View>
                {item.action === 'theme'
                  ? <Switch value={isDarkMode} onValueChange={onToggleDarkMode}/>
                  : <Icon name="chevron-right" size={14} color={isDarkMode ? "#9ca3af" : "#6b7280"} />}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ))}

      {/* Logout button */}
      <View className="px-4 mb-20">
        <TouchableOpacity onPress={onLogout} className={`p-4 rounded-lg ${isDarkMode ? "bg-red-900" : "bg-red-50"} shadow-sm`}>
          <View className="flex-row items-center justify-center">
            <Icon name="sign-out-alt" size={16} color="#dc2626" />
            <Text className="ml-2 text-red-600 font-medium">{t('settings.logout')}</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* App version label */}
      <View className="items-center pb-4">
        <Text className={`text-xs ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}>
          {t('settings.version')}
        </Text>
      </View>

      {/* --- PROFILE MODAL --- */}
      <Modal animationType="slide" transparent visible={isProfileModalVisible} onRequestClose={() => setIsProfileModalVisible(false)}>
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className={`w-11/12 p-6 rounded-lg ${isDarkMode ? "bg-gray-800" : "bg-white"}`}>
            <Text className={`mb-4 text-lg font-semibold ${isDarkMode ? "text-white" : "text-gray-800"}`}>
              {t('settings.editProfileTitle')}
            </Text>
            <AvatarPicker currentAvatar={avatar} onAvatarChange={handleAvatarChange} isDarkMode={isDarkMode}/>
            <TextInput
              value={name} onChangeText={setName}
              className={`mb-4 p-3 border rounded-lg ${isDarkMode ? "border-gray-600 bg-gray-700 text-white" : "border-gray-300 bg-white text-gray-800"}`}
              placeholder={t('settings.username')} placeholderTextColor={isDarkMode?"#9ca3af":"#6b7280"}
            />
            <TextInput
              value={newEmail} onChangeText={setNewEmail}
              className={`mb-6 p-3 border rounded-lg ${isDarkMode ? "border-gray-600 bg-gray-700 text-white" : "border-gray-300 bg-white text-gray-800"}`}
              placeholder={t('settings.email')} keyboardType="email-address"
            />
            <View className="flex-row justify-end space-x-3">
              <TouchableOpacity onPress={() => setIsProfileModalVisible(false)} className={`${isDarkMode ? "bg-gray-600" : "bg-gray-200"} px-4 py-2 rounded-lg`}>
                <Text className={isDarkMode?"text-gray-300":"text-gray-700"}>{t('settings.cancel')}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleSaveProfile} className="px-4 py-2 bg-blue-600 rounded-lg">
                <Text className="text-white">{t('settings.save')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ... SECURITY, NOTIFICATIONS, LANGUAGE modals annotated similarly ... */}

    </ScrollView>
);
};

export default SettingsScreen; // Export component
