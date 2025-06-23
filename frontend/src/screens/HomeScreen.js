import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { LinearGradient } from 'expo-linear-gradient';
import { formatCurrency } from '../utils/format';
import { categories } from '../utils/constants';
import CategoryBadge from '../components/CategoryBadge';
import TransactionCard from '../components/TransactionCard';
import { useTransactions } from '../hooks/useTransactions';

const HomeScreen = ({ 
  isDarkMode = false,
  onViewAllTransactions,
  onAddTransaction 
}) => {
  const selectedDate = new Date();
  const { transactions, stats, loading, error } = useTransactions();
  
  // Get recent transactions
  const recentTransactions = transactions.slice(0, 10);

  if (loading && transactions.length === 0) {
    return (
      <View className={`flex-1 justify-center items-center ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <ActivityIndicator size="large" color="#667eea" />
        <Text className={`mt-4 ${isDarkMode ? 'text-white' : 'text-gray-600'}`}>
          Đang tải dữ liệu...
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className={`flex-1 justify-center items-center p-4 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <Icon name="exclamation-triangle" size={48} color="#ef4444" />
        <Text className={`text-lg font-semibold mt-4 text-center ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
          Lỗi tải dữ liệu
        </Text>
        <Text className={`text-sm text-center mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          {error}
        </Text>
      </View>
    );
  }

  return (
    <ScrollView 
      className={`flex-1 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}
      showsVerticalScrollIndicator={false}
    >
      {/* Balance Card */}
      <View className="p-4">
        <LinearGradient
          colors={['#667eea', '#764ba2']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="rounded-2xl p-6 shadow-lg"
        >
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-white/80 text-sm">Số dư hiện tại</Text>
            <TouchableOpacity>
              <Icon name="eye" size={16} color="white" />
            </TouchableOpacity>
          </View>
          
          <Text className="text-3xl font-bold text-white mb-2">
            {formatCurrency(stats.balance)}
          </Text>
          
          <View className="flex-row justify-between">
            <View className="items-center">
              <Icon name="arrow-down" size={16} color="#10b981" />
              <Text className="text-white/80 text-xs mt-1">Thu nhập</Text>
              <Text className="text-white font-medium">{formatCurrency(stats.totalIncome)}</Text>
            </View>
            <View className="items-center">
              <Icon name="arrow-up" size={16} color="#ef4444" />
              <Text className="text-white/80 text-xs mt-1">Chi tiêu</Text>
              <Text className="text-white font-medium">{formatCurrency(stats.totalExpense)}</Text>
            </View>
          </View>
        </LinearGradient>
      </View>

      {/* Quick Actions
      <View className="px-4 mb-6">
        <Text className={`text-lg font-semibold mb-3 ${
          isDarkMode ? 'text-white' : 'text-gray-800'
        }`}>
          Thao tác nhanh
        </Text>
        <View className="flex-row justify-between">
          <TouchableOpacity 
            onPress={onAddTransaction}
            className="flex-1 bg-white rounded-lg p-4 mr-2 shadow-sm border border-gray-100"
          >
            <View className="w-10 h-10 rounded-full bg-blue-100 items-center justify-center mb-2">
              <Icon name="plus" size={20} color="#2563eb" />
            </View>
            <Text className="text-sm font-medium text-gray-800">Thêm giao dịch</Text>
          </TouchableOpacity>
          
          <TouchableOpacity className="flex-1 bg-white rounded-lg p-4 ml-2 shadow-sm border border-gray-100">
            <View className="w-10 h-10 rounded-full bg-green-100 items-center justify-center mb-2">
              <Icon name="chart-pie" size={20} color="#10b981" />
            </View>
            <Text className="text-sm font-medium text-gray-800">Xem thống kê</Text>
          </TouchableOpacity>
        </View>
      </View> */}

      {/* Categories */}
      <View className="px-4 mb-6">
        <View className="flex-row items-center justify-between mb-3">
          <Text className={`text-lg font-semibold ${
            isDarkMode ? 'text-white' : 'text-gray-800'
          }`}>
            Danh mục chi tiêu
          </Text>
          <TouchableOpacity>
            <Text className="text-blue-600 text-sm">Xem tất cả</Text>
          </TouchableOpacity>
        </View>
        
        <View className="flex-row flex-wrap justify-between">
          {categories.map((category) => (
            <View key={category.id} className="items-center mb-4" style={{ width: '22%' }}>
              <View className={`w-12 h-12 rounded-full ${category.color} items-center justify-center mb-2`}>
                <Icon name={category.icon} size={18} className={category.iconColor} />
              </View>
              <Text className="text-xs text-center text-gray-600">{category.name}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Recent Transactions */}
      <View className="px-4 mb-20">
        <View className="flex-row items-center justify-between mb-3">
          <Text className={`text-lg font-semibold ${
            isDarkMode ? 'text-white' : 'text-gray-800'
          }`}>
            Giao dịch gần đây
          </Text>
          <TouchableOpacity onPress={onViewAllTransactions}>
            <Text className="text-blue-600 text-sm">Xem tất cả</Text>
          </TouchableOpacity>
        </View>
        
        {recentTransactions.length === 0 ? (
          <View className="items-center py-8">
            <Icon name="receipt" size={48} color={isDarkMode ? '#6b7280' : '#d1d5db'} />
            <Text className={`text-lg font-medium mt-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Chưa có giao dịch nào
            </Text>
            <Text className={`text-sm text-center mt-2 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
              Thêm giao dịch đầu tiên để bắt đầu theo dõi chi tiêu
            </Text>
          </View>
        ) : (
          <View className="space-y-3">
            {recentTransactions.map((transaction) => (
              <TransactionCard
                key={transaction.id}
                transaction={transaction}
                isDarkMode={isDarkMode}
              />
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default HomeScreen;
