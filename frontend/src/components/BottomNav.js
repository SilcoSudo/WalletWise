import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { bottomNavItems } from '../utils/constants';

const BottomNav = ({ 
  activeScreen, 
  onNavigate, 
  onAddTransaction, 
  isDarkMode = false 
}) => {
  const insets = useSafeAreaInsets();

  return (
    <View 
      className="absolute bottom-0 left-0 w-full"
      style={{ paddingBottom: insets.bottom }}
    >
      <View className={`flex-row items-center justify-around h-14 border-t ${
        isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        {bottomNavItems.map((item) => {
          if (item.key === 'add') {
            return (
              <LinearGradient
                key={item.key}  
                colors={isDarkMode ? ["#30cfd0", "#330867"] : ["#a8edea", "#fed6e3"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className={`w-16 h-16 rounded-full items-center justify-center -mt-8 border-4 shadow-lg ${
                  isDarkMode ? 'border-gray-900' : 'border-white'
                }`}
              >
                <TouchableOpacity
                  onPress={onAddTransaction}
                  className="w-full h-full items-center justify-center"
                >
                  <Icon name={item.icon} size={24} color="white" />
                </TouchableOpacity>
              </LinearGradient>
            );
          }
          return (
            <TouchableOpacity
              key={item.key}
              onPress={() => onNavigate(item.key)}
              className="flex-1 items-center justify-center h-full"
            >
              <Icon 
                name={item.icon} 
                size={18} 
                color={activeScreen === item.key 
                  ? '#2563eb' 
                  : isDarkMode ? '#9ca3af' : '#6b7280'
                } 
              />
              <Text className={`text-xs mt-1 ${
                activeScreen === item.key 
                  ? 'text-blue-600' 
                  : isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

export default BottomNav;
