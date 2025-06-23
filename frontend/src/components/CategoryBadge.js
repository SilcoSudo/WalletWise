import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';

const CategoryBadge = ({ 
  category, 
  isSelected = false, 
  onPress, 
  size = 'normal' 
}) => {
  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return {
          container: 'w-8 h-8',
          icon: 14,
          text: 'text-xs'
        };
      case 'large':
        return {
          container: 'w-16 h-16',
          icon: 24,
          text: 'text-sm'
        };
      default:
        return {
          container: 'w-12 h-12',
          icon: 18,
          text: 'text-xs'
        };
    }
  };

  const sizeClasses = getSizeClasses();

  return (
    <TouchableOpacity
      onPress={onPress}
      className="items-center"
      disabled={!onPress}
    >
      <View className={`${sizeClasses.container} rounded-full ${category.color} items-center justify-center mb-2`}>
        <Icon 
          name={category.icon} 
          size={sizeClasses.icon} 
          className={category.iconColor} 
        />
      </View>
      {category.name && (
        <Text className={`text-center ${sizeClasses.text} text-gray-600`}>
          {category.name}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export default CategoryBadge;
