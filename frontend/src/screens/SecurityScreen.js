import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';

const SecurityScreen = ({ isDarkMode, onBack }) => {
  return (
    <View className={`flex-1 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <View className="p-4 flex-row items-center border-b border-gray-200 dark:border-gray-700">
        <TouchableOpacity onPress={onBack} className="p-2">
          <Icon name="arrow-left" size={20} color={isDarkMode ? 'white' : 'black'} />
        </TouchableOpacity>
        <Text className={`text-xl font-bold ml-4 ${isDarkMode ? 'text-white' : 'text-black'}`}>
          Bảo mật
        </Text>
      </View>
      <View className="p-4">
        <Text className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          Đây là nơi để thay đổi mật khẩu và các cài đặt bảo mật khác.
        </Text>
      </View>
    </View>
  );
};

export default SecurityScreen;
