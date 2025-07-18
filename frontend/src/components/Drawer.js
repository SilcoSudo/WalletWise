import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import Modal from "react-native-modal";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/FontAwesome5";
import { useTranslation } from 'react-i18next';
import { navigationItems } from "../utils/constants";
 
 const Drawer = ({
   isVisible,
  onClose,
  activeScreen,
  onNavigate,
  onLogout,
  user,
  isDarkMode = false,
}) => {
  const { t } = useTranslation();
  console.log(
    "Drawer: isVisible =",
    isVisible,
    "activeScreen =",
    activeScreen,
    "user =",
    user
  );

  const handleClose = () => {
    console.log("Drawer: Close button pressed");
    onClose && onClose();
  };

  const handleNavigate = (screen) => {
    console.log("Drawer: Navigate to", screen);
    onNavigate && onNavigate(screen);
  };

  const handleLogout = () => {
    console.log("Drawer: Logout button pressed");
    onLogout && onLogout();
  };

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={handleClose}
      onBackButtonPress={handleClose}
      animationIn="slideInLeft"
      animationOut="slideOutLeft"
      backdropOpacity={0.3}
      style={{ margin: 0, justifyContent: "flex-start" }}
      useNativeDriverForBackdrop
    >
      <View
        className={`h-full w-64 shadow-lg ${
          isDarkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        <LinearGradient
          colors={isDarkMode ? ["#d7d2cc", "#304352"] : ["#a8edea", "#fed6e3"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="p-4"
        >
          <View className="flex-row items-center space-x-3">
            <View className="h-12 w-12 rounded-full bg-gray-400 border-2 border-gray-600 overflow-hidden">
              <Image
                source={{
                  uri:
                    user && user.avatar
                      ? user.avatar
                      : "https://via.placeholder.com/100",
                }}
                className="w-full h-full rounded-full"
              />
            </View>
            <View>
              <Text
                className={`text-sm font-medium text-gray-700 px-4 mb-2 `}
              >
                {user ? user.username : t('drawer.user')}
              </Text>
              <Text className={`text-xs font-medium text-gray-700 px-4 mb-2 `}>
                {user ? user.email : "user@example.com"}
              </Text>
            </View>
          </View>
        </LinearGradient>

        <View className="py-2">
          {navigationItems.map((item) => (
            <TouchableOpacity
              key={item.key}
              onPress={() => handleNavigate(item.key)}
              className={`flex-row items-center w-full px-4 py-3 ${
                activeScreen === item.key
                  ? isDarkMode
                    ? "bg-gray-700"
                    : "bg-blue-50"
                  : ""
              }`}
            >
              <Icon
                name={item.icon}
                size={20}
                color={
                  activeScreen === item.key
                    ? isDarkMode
                      ? "#60a5fa"
                      : "#2563eb"
                    : isDarkMode
                    ? "#9ca3af"
                    : "#6b7280"
                }
              />
              <Text
                className={`ml-3 ${
                  activeScreen === item.key
                    ? isDarkMode
                      ? "text-blue-400"
                      : "text-blue-600"
                    : isDarkMode
                    ? "text-gray-300"
                    : "text-gray-700"
                }`}
              >
                {t(item.label)}
              </Text>
            </TouchableOpacity>
          ))}

          <View
            className={`h-px my-2 ${
              isDarkMode ? "bg-gray-600" : "bg-gray-200"
            }`}
          />

          <TouchableOpacity
            onPress={handleLogout}
            className="flex-row items-center w-full px-4 py-3"
          >
            <Icon
              name="sign-out-alt"
              size={20}
              color={isDarkMode ? "#9ca3af" : "#6b7280"}
            />
            <Text
              className={`ml-3 ${
                isDarkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              {t('drawer.logout')}
            </Text>
          </TouchableOpacity>
        </View>

        <View className="absolute bottom-4 left-4">
          <Text
            className={`text-xs ${
              isDarkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            {t('drawer.version')}
          </Text>
        </View>
      </View>
    </Modal>
  );
};

export default Drawer;
