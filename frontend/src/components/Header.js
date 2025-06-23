import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

const Header = ({ onMenuPress, onNotificationPress }) => {
  const insets = useSafeAreaInsets();
  
  const handleMenuPress = () => {
    console.log('Header: Menu button pressed');
    onMenuPress && onMenuPress();
  };
  
  const handleNotificationPress = () => {
    console.log('Header: Notification button pressed');
    onNotificationPress && onNotificationPress();
  };
  
  return (
    <LinearGradient
      colors={['#667eea', '#764ba2']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      className="flex-row items-center justify-between px-4 shadow-md" 
      style={{ 
        paddingTop: insets.top,
        height: 56 + insets.top,
      }}
    >
      <View className="flex-row items-center">
        <TouchableOpacity onPress={handleMenuPress} className="mr-3">
          <Icon name="bars" size={20} color="white" />
        </TouchableOpacity>
        <View className="flex-row items-center">
          <Icon name="wallet" size={20} color="white" />
          <Text className="font-medium text-lg text-white ml-2">WalletWise</Text>
        </View>
      </View>
      <View className="flex-row items-center space-x-4">
        <TouchableOpacity onPress={handleNotificationPress}>
          <Icon name="bell" size={20} color="white" />
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

export default Header;
