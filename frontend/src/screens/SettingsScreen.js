import React from "react";
import { View, Text, ScrollView, TouchableOpacity, Switch } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";
import { LinearGradient } from "expo-linear-gradient";

const SettingsScreen = ({ isDarkMode = false, onToggleDarkMode, onLogout }) => {
  const settingsSections = [
    {
      title: "Tài khoản",
      items: [
        { icon: "user", label: "Thông tin cá nhân", action: "profile" },
        { icon: "shield-alt", label: "Bảo mật", action: "security" },
        { icon: "bell", label: "Thông báo", action: "notifications" },
      ],
    },
    {
      title: "Ứng dụng",
      items: [
        { icon: "palette", label: "Giao diện", action: "theme" },
        { icon: "language", label: "Ngôn ngữ", action: "language" },
        { icon: "download", label: "Cập nhật", action: "update" },
      ],
    },
    {
      title: "Quản lý dữ liệu",
      items: [
        { icon: "download", label: "Xuất dữ liệu", action: "export", iconColor: "#10b981", bgColor: "bg-green-100" },
        { icon: "upload", label: "Nhập dữ liệu", action: "import", iconColor: "#3b82f6", bgColor: "bg-blue-100" },
        { icon: "trash-alt", label: "Xóa tất cả dữ liệu", action: "delete", iconColor: "#ef4444", bgColor: "bg-red-100" },
      ],
    },
    {
      title: "Hỗ trợ",
      items: [
        { icon: "question-circle", label: "Trợ giúp", action: "help" },
        { icon: "envelope", label: "Liên hệ", action: "contact" },
        { icon: "star", label: "Đánh giá", action: "rate" },
      ],
    },
  ];

  const handleSettingPress = (action) => {
    switch (action) {
      case 'theme':
        // Theme is handled by the toggle
        break;
      case 'export':
        handleExportData();
        break;
      case 'import':
        handleImportData();
        break;
      case 'delete':
        handleDeleteAllData();
        break;
      default:
        console.log(`Setting pressed: ${action}`);
        break;
    }
  };

  const handleExportData = () => {
    console.log("SettingsScreen: Export data pressed");
    // Here you would implement data export functionality
  };

  const handleImportData = () => {
    console.log("SettingsScreen: Import data pressed");
    // Here you would implement data import functionality
  };

  const handleDeleteAllData = () => {
    console.log("SettingsScreen: Delete all data pressed");
    // Here you would implement data deletion functionality
  };

  return (
    <ScrollView
      className={`flex-1 ${isDarkMode ? "bg-gray-900" : "bg-gray-50"}`}
      showsVerticalScrollIndicator={false}
    >
      {/* Profile Section */}
      <View className="p-4">
        <LinearGradient
          colors={["#a8edea", "#fed6e3"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="rounded-lg p-4 shadow-sm"
        >
          <Text className="text-lg font-semibold mb-4 text-gray-800">
            Tài khoản
          </Text>
          <View className="flex-row items-center mb-4">
            <View className="h-16 w-16 rounded-full bg-white/30 mr-4 border-2 border-white/50">
              <Icon
                name="user"
                size={24}
                color="#6b7280"
                style={{ textAlign: "center", lineHeight: 64 }}
              />
            </View>
            <View>
              <Text className="font-medium text-gray-800">
                Nguyễn Thị Hương
              </Text>
              <Text className="text-sm text-gray-600">
                huong.nguyen@gmail.com
              </Text>
            </View>
          </View>

          <TouchableOpacity className="border border-white/50 rounded-lg p-3 flex-row items-center justify-center bg-white/30">
            <Icon name="user-edit" size={16} color="#6b7280" />
            <Text className="ml-2 text-gray-700">Chỉnh sửa hồ sơ</Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>

      {/* General Settings
      <View className="px-4 mb-6">
        <View className={`rounded-lg p-4 shadow-sm ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        }`}>
          <Text className={`text-lg font-semibold mb-4 ${
            isDarkMode ? 'text-white' : 'text-gray-800'
          }`}>Cài đặt chung</Text>
          <View className="space-y-4">
            {[
              { label: 'Đơn vị tiền tệ', value: 'Đồng Việt Nam (VND)' },
              { label: 'Ngôn ngữ', value: 'Tiếng Việt' },
            ].map((item, index) => (
              <TouchableOpacity key={index} className="flex-row items-center justify-between py-2">
                <View>
                  <Text className={`font-medium ${
                    isDarkMode ? 'text-white' : 'text-gray-800'
                  }`}>{item.label}</Text>
                  <Text className={`text-sm ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>{item.value}</Text>
                </View>
                <Icon name="chevron-right" size={16} color={isDarkMode ? '#9ca3af' : '#9ca3af'} />
              </TouchableOpacity>
            ))}
            
           
            <View className="flex-row items-center justify-between py-2">
              <View>
                <Text className={`font-medium ${
                  isDarkMode ? 'text-white' : 'text-gray-800'
                }`}>Chế độ tối</Text>
                <Text className={`text-sm ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>{isDarkMode ? 'Bật' : 'Tắt'}</Text>
              </View>
              <TouchableOpacity 
                onPress={onToggleDarkMode}
                className={`w-12 h-6 rounded-full flex-row items-center ${
                  isDarkMode ? 'bg-purple-600' : 'bg-gray-300'
                }`}
              >
                <View className={`w-5 h-5 rounded-full bg-white shadow-sm ${
                  isDarkMode ? 'ml-6' : 'ml-1'
                }`} />
              </TouchableOpacity>
            </View>
            
            <TouchableOpacity className="flex-row items-center justify-between py-2">
              <View>
                <Text className={`font-medium ${
                  isDarkMode ? 'text-white' : 'text-gray-800'
                }`}>Thông báo</Text>
                <Text className={`text-sm ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>Bật</Text>
              </View>
              <Icon name="chevron-right" size={16} color={isDarkMode ? '#9ca3af' : '#9ca3af'} />
            </TouchableOpacity>
          </View>
        </View>
      </View> */}

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
            <Text className="text-red-600 font-medium ml-2">Đăng xuất</Text>
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
          Phiên bản 1.0.0
        </Text>
      </View>
    </ScrollView>
  );
};

export default SettingsScreen;
