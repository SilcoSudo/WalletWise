import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  StatusBar,
  Platform,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";
import { LinearGradient } from "expo-linear-gradient";
import { categories } from "../utils/constants";
import { SafeAreaView } from "react-native-safe-area-context";
import { useCategories } from '../hooks/useCategories';
import { useTranslation } from 'react-i18next';
import DateTimePicker from '@react-native-community/datetimepicker';

const EditTransactionScreen = ({
  isDarkMode,
  transaction,
  onUpdateTransaction,
  onDeleteTransaction,
  navigation,
}) => {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [type, setType] = useState("");
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const { categories, loading: loadingCategories } = useCategories();
  const { t } = useTranslation();

  useEffect(() => {
    if (transaction) {
      setAmount(transaction.amount.toString());
      setDescription(transaction.description || "");
      setSelectedCategory(transaction.category || "");
      setType(transaction.type || "expense");
      setDate(transaction.date ? new Date(transaction.date) : new Date());
    }
  }, [transaction]);

  const onChangeDate = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const handleUpdate = async () => {
    if (!amount || !description || !selectedCategory) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin");
      return;
    }

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      Alert.alert("Lỗi", "Số tiền không hợp lệ");
      return;
    }

    try {
      setLoading(true);
      await onUpdateTransaction(transaction.id, {
        amount: numAmount,
        description,
        category: selectedCategory,
        type: type,
        date: date,
      });
      navigation.goBack();
    } catch (err) {
      console.error("Error updating transaction:", err);
      Alert.alert("Lỗi", "Không thể cập nhật giao dịch");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    Alert.alert("Xoá giao dịch", "Bạn có chắc muốn xoá giao dịch này?", [
      { text: "Huỷ", style: "cancel" },
      {
        text: "Xoá",
        style: "destructive",
        onPress: async () => {
          try {
            await onDeleteTransaction(transaction.id);
            navigation.goBack();
          } catch (err) {
            Alert.alert("Lỗi", "Không thể xoá giao dịch");
          }
        },
      },
    ]);
  };

  return (
    <View className={`flex-1 ${isDarkMode ? "bg-gray-900" : "bg-white"}`}>
      <ScrollView
        showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}
      >
        <StatusBar
          barStyle={isDarkMode ? "light-content" : "dark-content"}
          backgroundColor={isDarkMode ? "#111827" : "#f9fafb"}
        />
<View className="p-6">
        {/* Header */}
        <View
          className={`${isDarkMode ? "bg-gray-800" : "bg-white"} shadow-sm`}
        >
          <View className="flex-row items-center justify-between p-4">
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Icon
                name="arrow-left"
                size={24}
                color={isDarkMode ? "#9ca3af" : "#6b7280"}
              />
            </TouchableOpacity>
            <Text
              className={`text-xl font-bold ${
                isDarkMode ? "text-white" : "text-gray-800"
              }`}
            >
              {t('transaction.edit')}
            </Text>
            <View style={{ width: 24 }} />
          </View>
        </View>

        {/* Loại giao dịch */}
        <View className="mb-6">
          <Text
            className={`text-lg font-semibold mb-3 ${
              isDarkMode ? "text-white" : "text-gray-800"
            }`}
          >
            {t('transaction.type')}
          </Text>
          <View className="flex-row space-x-3">
            <TouchableOpacity
              onPress={() => setType("expense")}
              className={`flex-1 py-3 rounded-lg border-2 ${
                type === "expense"
                  ? "border-red-500 bg-red-50"
                  : isDarkMode
                  ? "border-gray-600 bg-gray-700"
                  : "border-gray-300 bg-gray-50"
              }`}
            >
              <View className="items-center">
                <Icon
                  name="arrow-up"
                  size={20}
                  color={
                    type === "expense"
                      ? "#ef4444"
                      : isDarkMode
                      ? "#9ca3af"
                      : "#6b7280"
                  }
                />
                <Text
                  className={`mt-1 font-medium ${
                    type === "expense"
                      ? "text-red-600"
                      : isDarkMode
                      ? "text-gray-300"
                      : "text-gray-600"
                  }`}
                >
                  Chi tiêu
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setType("income")}
              className={`flex-1 py-3 rounded-lg border-2 ${
                type === "income"
                  ? "border-green-500 bg-green-50"
                  : isDarkMode
                  ? "border-gray-600 bg-gray-700"
                  : "border-gray-300 bg-gray-50"
              }`}
            >
              <View className="items-center">
                <Icon
                  name="arrow-down"
                  size={20}
                  color={
                    type === "income"
                      ? "#10b981"
                      : isDarkMode
                      ? "#9ca3af"
                      : "#6b7280"
                  }
                />
                <Text
                  className={`mt-1 font-medium ${
                    type === "income"
                      ? "text-green-600"
                      : isDarkMode
                      ? "text-gray-300"
                      : "text-gray-600"
                  }`}
                >
                  Thu nhập
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Số tiền */}
        <View className="mb-6">
          <Text
            className={`text-lg font-semibold mb-3 ${
              isDarkMode ? "text-white" : "text-gray-800"
            }`}
          >
            {t('transaction.amount')}
          </Text>
          <View
            className={`flex-row items-center border rounded-lg px-3 py-3 ${
              isDarkMode
                ? "bg-gray-700 border-gray-600"
                : "bg-white border-gray-300"
            }`}
          >
            <Icon
              name="money-bill-wave"
              size={20}
              color={isDarkMode ? "#9ca3af" : "#6b7280"}
              className="mr-3"
            />
            <TextInput
              value={amount}
              onChangeText={setAmount}
              placeholder={t('transaction.amountPlaceholder')}
              placeholderTextColor={isDarkMode ? "#9ca3af" : "#9ca3af"}
              className={`flex-1 text-lg ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
              keyboardType="numeric"
            />
            <Text
              className={`text-lg ${
                isDarkMode ? "text-gray-300" : "text-gray-600"
              }`}
            >
              VNĐ
            </Text>
          </View>
        </View>

        {/* Mô tả */}
        <View className="mb-6">
          <Text
            className={`text-lg font-semibold mb-3 ${
              isDarkMode ? "text-white" : "text-gray-800"
            }`}
          >
            {t('transaction.description')}
          </Text>
          <View
            className={`border rounded-lg px-3 py-3 ${
              isDarkMode
                ? "bg-gray-700 border-gray-600"
                : "bg-white border-gray-300"
            }`}
          >
            <TextInput
              value={description}
              onChangeText={setDescription}
              placeholder={t('transaction.descriptionPlaceholder')}
              placeholderTextColor={isDarkMode ? "#9ca3af" : "#9ca3af"}
              className={`text-base ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
              multiline
              numberOfLines={3}
            />
          </View>
        </View>

        {/* Danh mục */}
        <View className="mb-6">
          <Text className={`text-lg font-semibold mb-3 ${isDarkMode ? "text-white" : "text-gray-800"}`}>{t('transaction.category')}</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {loadingCategories ? (
              <Text className={isDarkMode ? "text-white" : "text-gray-800"}>Đang tải...</Text>
            ) : categories.filter((category) => category.type === type).map((category) => (
              <TouchableOpacity
                key={category._id || category.id}
                onPress={() => setSelectedCategory(category.name)}
                className={`mr-3 p-3 rounded-lg border-2 ${
                  selectedCategory === category.name
                    ? "border-blue-500 bg-blue-50"
                    : isDarkMode
                    ? "border-gray-600 bg-gray-700"
                    : "border-gray-300 bg-gray-50"
                }`}
              >
                <View className="items-center">
                  <View
                    className={`w-10 h-10 rounded-full ${category.color} items-center justify-center mb-2`}
                    style={{ backgroundColor: category.bgColor || undefined }}
                  >
                    <Icon
                      name={category.icon}
                      size={18}
                      className={category.iconColor}
                      color={category.color || undefined}
                    />
                  </View>
                  <Text
                    className={`text-xs text-center ${
                      selectedCategory === category.name
                        ? "text-blue-600 font-medium"
                        : isDarkMode
                        ? "text-gray-300"
                        : "text-gray-600"
                    }`}
                  >
                    {category.name}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Ngày giao dịch */}
        <View className="mb-6">
          <Text className={`text-lg font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
            {t('transaction.date') || 'Ngày giao dịch'}
          </Text>
          <TouchableOpacity
            onPress={() => setShowDatePicker(true)}
            className={`border rounded-lg px-3 py-3 ${
              isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
            }`}
          >
            <Text className={`text-base ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {date ? `${('0' + date.getDate()).slice(-2)}/${('0' + (date.getMonth()+1)).slice(-2)}/${date.getFullYear()}` : ''}
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

        {/* Nút lưu */}
        <TouchableOpacity
          onPress={handleUpdate}
          disabled={loading}
          className="mt-6"
        >
          <LinearGradient
            colors={
              isDarkMode ? ["#d7d2cc", "#304352"] : ["#667eea", "#764ba2"]
            }
            start={{ x: 0, y: 0 }}
            className="rounded-lg py-4 items-center"
          >
            <Text className="text-white text-lg font-semibold">
              {loading ? "Đang lưu..." : t('common.save')}
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Nút xoá */}
        <TouchableOpacity
          onPress={handleDelete}
          className="mt-4 items-center py-3 rounded-lg border border-red-500 mb-8"
        >
          <Text className="text-red-500 font-semibold">{t('common.delete')}</Text>
        </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default EditTransactionScreen;
