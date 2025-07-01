import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { formatCurrency } from '../utils/format';

// ===================== THẺ GIAO DỊCH =====================
// Component này hiển thị thông tin từng giao dịch (dùng trong danh sách giao dịch, modal, v.v.)

const TransactionCard = ({ 
  transaction, 
  isDarkMode = false,
  onPress 
}) => {
  const getTransactionIcon = (type, category) => {
    if (type === 'income') return 'money-bill-wave';
    switch (category) {
      case 'food': return 'utensils';
      case 'housing': return 'home';
      case 'transport': return 'car';
      case 'entertainment': return 'gamepad';
      case 'shopping': return 'shopping-bag';
      case 'health': return 'heartbeat';
      case 'education': return 'graduation-cap';
      case 'utilities': return 'bolt';
      default: return 'receipt';
    }
  };

  const getIconColor = (type) => {
    return type === 'income' ? '#10b981' : '#ef4444';
  };

  const getBackgroundColor = (type) => {
    return type === 'income' ? 'bg-green-100' : 'bg-red-100';
  };

  return (
    <TouchableOpacity 
      onPress={onPress}
      className={`flex-row items-center justify-between p-3 rounded-lg shadow-sm border ${
        isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
      }`}
    >
      <View className="flex-row items-center">
        <View className={`w-10 h-10 rounded-full ${getBackgroundColor(transaction.type)} items-center justify-center`}>
          <Icon 
            name={getTransactionIcon(transaction.type, transaction.category)} 
            size={16} 
            color={getIconColor(transaction.type)} 
          />
        </View>
        <View className="ml-3">
          <Text className={`font-medium ${
            isDarkMode ? 'text-white' : 'text-gray-800'
          }`}>{transaction.description}</Text>
          <Text className={`text-xs ${
            isDarkMode ? 'text-gray-400' : 'text-gray-500'
          }`}>{new Date(transaction.date).toLocaleDateString()}</Text>
        </View>
      </View>
      <Text className={`font-medium ${
        transaction.type === 'income' ? 'text-green-500' : 'text-red-500'
      }`}>
        {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
      </Text>
    </TouchableOpacity>
  );
};

export default TransactionCard;
