import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
  Alert,
  Platform,
  StatusBar
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useCategories } from '../hooks/useCategories';
import DateTimePicker from "@react-native-community/datetimepicker";
import { SafeAreaView } from 'react-native-safe-area-context';

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
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const { categories, loading: loadingCategories } = useCategories();

  const onChangeDate = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const handleSave = async () => {
    if (!amount || !description) {
      Alert.alert('Lỗi', 'Vui lòng nhập số tiền và mô tả');
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
        category: selectedCategory,
        amount: numAmount,
        description,
        date
      });
      
      // Reset form
      setAmount('');
      setDescription('');
      setSelectedCategory('');
      setType('expense');
      setDate(new Date());
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
      setDate(new Date());
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
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor="transparent"
        translucent={true}
      />
      <SafeAreaView className={`flex-1 justify-end ${isDarkMode ? 'bg-black/50' : 'bg-black/30'}`}>
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

            {/* Ngày giao dịch */}
            <View className="mb-6">
              <Text className={`text-lg font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                Ngày giao dịch
              </Text>
              <TouchableOpacity
                onPress={() => setShowDatePicker(true)}
                className={`border rounded-lg px-3 py-3 ${
                  isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                }`}
              >
                <Text className={`text-base ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {date.toISOString().split("T")[0]}
                </Text>
              </TouchableOpacity>

              {showDatePicker && (
                <DateTimePicker
                  value={date}
                  mode="date"
                  display={Platform.OS === "ios" ? "spinner" : "default"}
                  onChange={onChangeDate}
                  maximumDate={new Date()}
                />
              )}
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

            {/* Category Selection - Show filtered by transaction type */}
            <View className="mb-6">
              <Text className={`text-lg font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                Danh mục
              </Text>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                className="flex-row"
              >
                {categories
                  .filter(category => category.type === type)
                  .map((category) => (
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

            {/* Save Button */}
            <TouchableOpacity
              onPress={handleSave}
              disabled={loading}
              className="mt-6"
            >
              <LinearGradient
                colors={isDarkMode ? ["#d7d2cc", "#304352"] : ["#667eea", "#764ba2"]}
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
      </SafeAreaView>
    </Modal>
  );
};

export default ModalAddTransaction;
