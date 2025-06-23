import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { navigationItems } from '../utils/constants';

const Drawer = ({ 
  isVisible, 
  onClose, 
  activeScreen, 
  onNavigate, 
  onLogout,
  user 
}) => {
  console.log('Drawer: isVisible =', isVisible, 'activeScreen =', activeScreen, 'user =', user);
  
  const handleClose = () => {
    console.log('Drawer: Close button pressed');
    onClose && onClose();
  };
  
  const handleNavigate = (screen) => {
    console.log('Drawer: Navigate to', screen);
    onNavigate && onNavigate(screen);
  };
  
  const handleLogout = () => {
    console.log('Drawer: Logout button pressed');
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
      style={{ margin: 0 }}
      useNativeDriverForBackdrop
    >
      <View className="h-full w-64 bg-white shadow-lg">
        <View className="p-4 bg-blue-600">
          <View className="flex-row items-center space-x-3">
            <View className="h-12 w-12 rounded-full bg-gray-300 border-2 border-white">
              <Image 
                source={{ uri: 'https://via.placeholder.com/100' }}
                className="w-full h-full rounded-full"
              />
            </View>
            <View>
              <Text className="font-medium text-white">
                {user ? user.username : 'Người dùng'}
              </Text>
              <Text className="text-xs text-white/80">
                {user ? user.email : 'user@example.com'}
              </Text>
            </View>
          </View>
        </View>
        
        <View className="py-2">
          {navigationItems.map((item) => (
            <TouchableOpacity
              key={item.key}
              onPress={() => handleNavigate(item.key)}
              className={`flex-row items-center w-full px-4 py-3 ${
                activeScreen === item.key ? 'bg-blue-50' : ''
              }`}
            >
              <Icon 
                name={item.icon} 
                size={20} 
                color={activeScreen === item.key ? '#2563eb' : '#6b7280'} 
              />
              <Text className={`ml-3 ${
                activeScreen === item.key ? 'text-blue-600' : 'text-gray-700'
              }`}>
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
          
          <View className="h-px bg-gray-200 my-2" />
          
          <TouchableOpacity
            onPress={handleLogout}
            className="flex-row items-center w-full px-4 py-3"
          >
            <Icon name="sign-out-alt" size={20} color="#6b7280" />
            <Text className="ml-3 text-gray-700">Đăng xuất</Text>
          </TouchableOpacity>
        </View>
        
        <View className="absolute bottom-4 left-4">
          <Text className="text-xs text-gray-500">Phiên bản 1.0.0</Text>
        </View>
      </View>
    </Modal>
  );
};

export default Drawer;
