import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { LinearGradient } from 'expo-linear-gradient';
import { formatCurrency } from '../utils/format';
import { categories } from '../utils/constants';
import CategoryBadge from '../components/CategoryBadge';
import TransactionCard from '../components/TransactionCard';
import { useTransactionsContext } from '../hooks/useTransactions';
import Modal from 'react-native-modal';

const HomeScreen = ({ 
  isDarkMode = false,
  onViewAllTransactions,
  onAddTransaction 
}) => {
  const selectedDate = new Date();
  const { transactions, stats, loading, error } = useTransactionsContext();
  
  // Get recent transactions
  const recentTransactions = transactions.slice(0, 10);

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);

  // Lọc giao dịch theo danh mục đang chọn
  const categoryTransactions = selectedCategory
    ? transactions.filter(t => t.category === selectedCategory.name)
    : [];

  // Modal hiển thị chi tiết giao dịch
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [transactionModalVisible, setTransactionModalVisible] = useState(false);

  // State để kiểm soát việc ẩn/hiện số dư
  const [showBalance, setShowBalance] = useState(true);

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
      {/* ===================== MÀN HÌNH TRANG CHỦ ===================== */}
      {/* Đây là màn hình chính hiển thị số dư, thu nhập, chi tiêu, giao dịch gần đây và cho phép xem giao dịch theo danh mục. */}
      {/* Sử dụng context để lấy dữ liệu giao dịch và thống kê, đồng thời hỗ trợ ẩn/hiện số dư bằng icon con mắt. */}
      {/* ===================== THẺ SỐ DƯ ===================== */}
      {/* Hiển thị số dư hiện tại, thu nhập, chi tiêu */}
      <View className="p-4">
        <LinearGradient
          colors={['#667eea', '#764ba2']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="rounded-2xl p-6 shadow-lg"
        >
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-white/80 text-sm">Số dư hiện tại</Text>
            <TouchableOpacity onPress={() => setShowBalance(v => !v)}>
              <Icon name={showBalance ? 'eye' : 'eye-slash'} size={16} color="white" />
            </TouchableOpacity>
          </View>
          
          <Text className="text-3xl font-bold text-white mb-2">
            {showBalance ? formatCurrency(stats.balance) : '******'}
          </Text>
          
          <View className="flex-row justify-between">
            <View className="items-center">
              <Icon name="arrow-down" size={16} color="#10b981" />
              <Text className="text-white/80 text-xs mt-1">Thu nhập</Text>
              <Text className="text-white font-medium">{showBalance ? formatCurrency(stats.totalIncome) : '******'}</Text>
            </View>
            <View className="items-center">
              <Icon name="arrow-up" size={16} color="#ef4444" />
              <Text className="text-white/80 text-xs mt-1">Chi tiêu</Text>
              <Text className="text-white font-medium">{showBalance ? formatCurrency(stats.totalExpense) : '******'}</Text>
            </View>
          </View>
        </LinearGradient>
      </View>

      {/* ===================== DANH MỤC CHI TIÊU ===================== */}
      {/* Hiển thị các danh mục, nhấn vào để xem giao dịch theo danh mục */}
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
            <TouchableOpacity
              key={category.id}
              className="items-center mb-4"
              style={{ width: '22%' }}
              onPress={() => {
                setSelectedCategory(category);
                setModalVisible(true);
              }}
            >
              <View className={`w-12 h-12 rounded-full ${category.color} items-center justify-center mb-2`}>
                <Icon name={category.icon} size={18} className={category.iconColor} />
              </View>
              <Text className="text-xs text-center text-gray-600">{category.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* ===================== GIAO DỊCH GẦN ĐÂY ===================== */}
      {/* Hiển thị danh sách 10 giao dịch gần nhất */}
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
                onPress={() => {
                  setSelectedTransaction(transaction);
                  setTransactionModalVisible(true);
                }}
              />
            ))}
          </View>
        )}
      </View>

      {/* ===================== MODAL XEM GIAO DỊCH THEO DANH MỤC ===================== */}
      <Modal isVisible={isModalVisible} onBackdropPress={() => setModalVisible(false)}>
        <View className={`bg-white rounded-2xl p-4 max-h-[70%] ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
          <Text className={`text-lg font-bold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
            Giao dịch: {selectedCategory ? selectedCategory.name : ''}
          </Text>
          {categoryTransactions.length === 0 ? (
            <Text className="text-center text-gray-500">Chưa có giao dịch nào</Text>
          ) : (
            <ScrollView style={{ maxHeight: 300 }}>
              {categoryTransactions.map((transaction) => (
                <TransactionCard
                  key={transaction.id}
                  transaction={transaction}
                  isDarkMode={isDarkMode}
                  onPress={() => {
                    setSelectedTransaction(transaction);
                    setTransactionModalVisible(true);
                  }}
                />
              ))}
            </ScrollView>
          )}
          <TouchableOpacity
            className="mt-4 py-2 px-4 bg-blue-600 rounded-lg"
            onPress={() => setModalVisible(false)}
          >
            <Text className="text-white text-center font-semibold">Đóng</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {/* ===================== MODAL CHI TIẾT GIAO DỊCH ===================== */}
      <Modal isVisible={transactionModalVisible} onBackdropPress={() => setTransactionModalVisible(false)}>
        <View className={`bg-white rounded-2xl p-4 max-w-[90%] ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
          <Text className={`text-lg font-bold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Chi tiết giao dịch</Text>
          {selectedTransaction && (
            <>
              <Text className={`mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Mô tả: {selectedTransaction.description}</Text>
              <Text className={`mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Số tiền: {selectedTransaction.type === 'income' ? '+' : '-'}{formatCurrency(selectedTransaction.amount)}</Text>
              <Text className={`mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Loại: {selectedTransaction.type === 'income' ? 'Thu nhập' : 'Chi tiêu'}</Text>
              <Text className={`mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Danh mục: {selectedTransaction.category}</Text>
              <Text className={`mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Ngày: {new Date(selectedTransaction.date).toLocaleDateString()}</Text>
            </>
          )}
          <TouchableOpacity
            className="mt-4 py-2 px-4 bg-blue-600 rounded-lg"
            onPress={() => setTransactionModalVisible(false)}
          >
            <Text className="text-white text-center font-semibold">Đóng</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default HomeScreen;
