import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
  Alert
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { categories } from '../utils/constants';

// ===================== MODAL THÊM GIAO DỊCH =====================
// Component này hiển thị form để người dùng nhập thông tin giao dịch mới (loại, số tiền, mô tả, danh mục).
// Nhận các props: visible (hiện/ẩn modal), onClose (đóng modal), onAddTransaction (hàm thêm giao dịch).
const ModalAddTransaction = ({
  isDarkMode = false,
  visible = false,
  onClose,
  onAddTransaction
}) => {
  const [type, setType] = useState('expense');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!amount || !description) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin');
      return;
    }

    // Nếu là thu nhập và chưa chọn danh mục, tự động set danh mục mặc định
    let finalCategory = selectedCategory;
    if (type === 'income' && !selectedCategory) {
      finalCategory = 'Lương';
    } else if (type === 'expense' && !selectedCategory) {
      Alert.alert('Lỗi', 'Vui lòng chọn danh mục');
      return;
    }

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      Alert.alert('Lỗi', 'Số tiền không hợp lệ');
      return;
    }

    try {
      setLoading(true);
      await onAddTransaction({
        type,
        category: finalCategory,
        amount: numAmount,
        description,
        date: new Date()
      });
      // Reset form
      setAmount('');
      setDescription('');
      setSelectedCategory('');
      setType('expense');
      onClose(); // Đóng modal ngay sau khi lưu thành công
    } catch (error) {
      console.error('Failed to add transaction:', error);
      Alert.alert('Lỗi', 'Không thể thêm giao dịch');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setAmount('');
      setDescription('');
      setSelectedCategory('');
      setType('expense');
      onClose();
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleClose}
    >
      <View className={`flex-1 justify-end ${isDarkMode ? 'bg-black/50' : 'bg-black/30'}`}>
        <View className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-t-3xl max-h-3/4`}>
          {/* Header */}
          <View className="flex-row items-center justify-between p-6 border-b border-gray-200">
            <Text className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
              Thêm giao dịch
            </Text>
            <TouchableOpacity onPress={handleClose} disabled={loading}>
              <Icon 
                name="times" 
                size={24} 
                color={isDarkMode ? '#9ca3af' : '#6b7280'} 
              />
            </TouchableOpacity>
          </View>

          <ScrollView className="p-6" showsVerticalScrollIndicator={false}>
            {/* Transaction Type */}
            <View className="mb-6">
              <Text className={`text-lg font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                Loại giao dịch
              </Text>
              <View className="flex-row space-x-3">
                <TouchableOpacity
                  onPress={() => setType('expense')}
                  className={`flex-1 py-3 rounded-lg border-2 ${
                    type === 'expense'
                      ? 'border-red-500 bg-red-50'
                      : isDarkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-300 bg-gray-50'
                  }`}
                >
                  <View className="items-center">
                    <Icon 
                      name="arrow-up" 
                      size={20} 
                      color={type === 'expense' ? '#ef4444' : (isDarkMode ? '#9ca3af' : '#6b7280')} 
                    />
                    <Text className={`mt-1 font-medium ${
                      type === 'expense' ? 'text-red-600' : (isDarkMode ? 'text-gray-300' : 'text-gray-600')
                    }`}>
                      Chi tiêu
                    </Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setType('income')}
                  className={`flex-1 py-3 rounded-lg border-2 ${
                    type === 'income'
                      ? 'border-green-500 bg-green-50'
                      : isDarkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-300 bg-gray-50'
                  }`}
                >
                  <View className="items-center">
                    <Icon 
                      name="arrow-down" 
                      size={20} 
                      color={type === 'income' ? '#10b981' : (isDarkMode ? '#9ca3af' : '#6b7280')} 
                    />
                    <Text className={`mt-1 font-medium ${
                      type === 'income' ? 'text-green-600' : (isDarkMode ? 'text-gray-300' : 'text-gray-600')
                    }`}>
                      Thu nhập
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>

            {/* Amount */}
            <View className="mb-6">
              <Text className={`text-lg font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                Số tiền
              </Text>
              <View className={`flex-row items-center border rounded-lg px-3 py-3 ${
                isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
              }`}>
                <Icon 
                  name="money-bill-wave" 
                  size={20} 
                  color={isDarkMode ? '#9ca3af' : '#6b7280'} 
                  className="mr-3"
                />
                <TextInput
                  value={amount}
                  onChangeText={setAmount}
                  placeholder="Nhập số tiền"
                  placeholderTextColor={isDarkMode ? '#9ca3af' : '#9ca3af'}
                  className={`flex-1 text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
                  keyboardType="numeric"
                />
                <Text className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  VNĐ
                </Text>
              </View>
            </View>

            {/* Description */}
            <View className="mb-6">
              <Text className={`text-lg font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                Mô tả
              </Text>
              <View className={`border rounded-lg px-3 py-3 ${
                isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
              }`}>
                <TextInput
                  value={description}
                  onChangeText={setDescription}
                  placeholder="Nhập mô tả giao dịch"
                  placeholderTextColor={isDarkMode ? '#9ca3af' : '#9ca3af'}
                  className={`text-base ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
                  multiline
                  numberOfLines={3}
                />
              </View>
            </View>

            {/* Category Selection - Only show for expense */}
            {type === 'expense' ? (
              <View className="mb-6">
                <Text className={`text-lg font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                  Danh mục
                </Text>
                <ScrollView 
                  horizontal 
                  showsHorizontalScrollIndicator={false}
                  className="flex-row"
                >
                  {categories.map((category) => (
                    <TouchableOpacity
                      key={category.id}
                      onPress={() => setSelectedCategory(category.name)}
                      className={`mr-3 p-3 rounded-lg border-2 ${
                        selectedCategory === category.name
                          ? 'border-blue-500 bg-blue-50'
                          : isDarkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-300 bg-gray-50'
                      }`}
                    >
                      <View className="items-center">
                        <View className={`w-10 h-10 rounded-full ${category.color} items-center justify-center mb-2`}>
                          <Icon name={category.icon} size={18} className={category.iconColor} />
                        </View>
                        <Text className={`text-xs text-center ${
                          selectedCategory === category.name
                            ? 'text-blue-600 font-medium'
                            : isDarkMode ? 'text-gray-300' : 'text-gray-600'
                        }`}>
                          {category.name}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            ) : (
              <View className="mb-6">
                <Text className={`text-lg font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                  Danh mục thu nhập
                </Text>
                <ScrollView 
                  horizontal 
                  showsHorizontalScrollIndicator={false}
                  className="flex-row"
                >
                  {['Lương', 'Thưởng', 'Đầu tư', 'Khác'].map((category) => (
                    <TouchableOpacity
                      key={category}
                      onPress={() => setSelectedCategory(category)}
                      className={`mr-3 p-3 rounded-lg border-2 ${
                        selectedCategory === category
                          ? 'border-green-500 bg-green-50'
                          : isDarkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-300 bg-gray-50'
                      }`}
                    >
                      <View className="items-center">
                        <View className={`w-10 h-10 rounded-full bg-green-100 items-center justify-center mb-2`}>
                          <Icon name="money-bill-wave" size={18} className="text-green-500" />
                        </View>
                        <Text className={`text-xs text-center ${
                          selectedCategory === category
                            ? 'text-green-600 font-medium'
                            : isDarkMode ? 'text-gray-300' : 'text-gray-600'
                        }`}>
                          {category}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}

            {/* Save Button */}
            <TouchableOpacity
              onPress={handleSave}
              disabled={loading}
              className="mt-6"
            >
              <LinearGradient
                colors={['#667eea', '#764ba2']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className="rounded-lg py-4 items-center"
              >
                <Text className="text-white text-lg font-semibold">
                  {loading ? 'Đang lưu...' : 'Lưu giao dịch'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default ModalAddTransaction;
