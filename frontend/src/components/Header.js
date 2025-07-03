import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";

const Header = ({ onMenuPress, onNotificationPress, isDarkMode = false }) => {
  const insets = useSafeAreaInsets();

  const handleMenuPress = () => {
    console.log("Header: Menu button pressed");
    onMenuPress && onMenuPress();
  };

  const handleNotificationPress = () => {
    console.log("Header: Notification button pressed");
    onNotificationPress && onNotificationPress();
  };

  return (
    <LinearGradient
      colors={isDarkMode ? ["#374151", "#1f2937"] : ["#a8edea", "#fed6e3"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      className="flex-row items-center justify-between px-4 shadow-md"
      style={{
        paddingTop: 8,
        paddingBottom: 8,
        minHeight: 56,
      }}
    >
      <View className="flex-row items-center">
        <TouchableOpacity onPress={handleMenuPress} className="mr-3">
          <Icon 
            name="bars" 
            size={20} 
            color={isDarkMode ? "#ffffff" : "#374151"} 
          />
        </TouchableOpacity>
        <View className="flex-row items-center">
          <Icon 
            name="wallet" 
            size={20} 
            color={isDarkMode ? "#ffffff" : "#374151"} 
          />
          <Text className={`font-medium text-lg ml-2 ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>
            WalletWise
          </Text>
        </View>
      </View>
      <View className="flex-row items-center">
        <TouchableOpacity onPress={handleNotificationPress}>
          <Icon 
            name="bell" 
            size={20} 
            color={isDarkMode ? "#ffffff" : "#374151"} 
          />
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

export default Header;
