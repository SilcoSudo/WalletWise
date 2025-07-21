import React, { useState } from "react";
import { View, ScrollView, StatusBar, Alert, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import DateTimePicker from "@react-native-community/datetimepicker";
import Icon from "react-native-vector-icons/FontAwesome5";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../hooks/useTheme";
import { useTransactionsContext } from "../hooks/useTransactions";
import { categories } from "../utils/constants";

import { Text, TextInput, TouchableOpacity } from "react-native";

const AddTransactionScreen = ({ onClose }) => {
  const { isDarkMode } = useTheme();
  const { addTransaction } = useTransactionsContext();

  const [type, setType] = useState("expense");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);

  const onChangeDate = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) setDate(selectedDate);
  };

  const handleSave = async () => {
    if (!amount || !description) {
      Alert.alert("Lỗi", "Vui lòng nhập số tiền và mô tả");
      return;
    }

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      Alert.alert("Lỗi", "Số tiền không hợp lệ");
      return;
    }

    try {
      setLoading(true);
      await addTransaction({
        type,
        category: selectedCategory,
        amount: numAmount,
        description,
        date,
      });

      Alert.alert("Thành công", "Giao dịch đã được thêm!");
      onClose();
    } catch (err) {
      console.error("Error adding transaction:", err);
      Alert.alert("Lỗi", "Không thể thêm giao dịch");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView
      className={`flex-1 ${isDarkMode ? "bg-gray-900" : "bg-white"}`}
    >
      <StatusBar
        barStyle={isDarkMode ? "light-content" : "dark-content"}
        backgroundColor="transparent"
        translucent={true}
      />
      <View className="p-6">
        <Text
          className={`text-xl font-bold mb-4 ${
            isDarkMode ? "text-white" : "text-gray-900"
          }`}
        >
          Thêm giao dịch
        </Text>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Loại giao dịch */}
          <View className="mb-6">
            <Text
              className={`text-lg font-semibold mb-3 ${
                isDarkMode ? "text-white" : "text-gray-800"
              }`}
            >
              Loại giao dịch
            </Text>
            <View className="flex-row space-x-3">
              {["expense", "income"].map((item) => (
                <TouchableOpacity
                  key={item}
                  onPress={() => setType(item)}
                  className={`flex-1 py-3 rounded-lg border-2 ${
                    type === item
                      ? item === "expense"
                        ? "border-red-500 bg-red-50"
                        : "border-green-500 bg-green-50"
                      : isDarkMode
                      ? "border-gray-600 bg-gray-700"
                      : "border-gray-300 bg-gray-50"
                  }`}
                >
                  <View className="items-center">
                    <Icon
                      name={item === "expense" ? "arrow-up" : "arrow-down"}
                      size={20}
                      color={
                        type === item
                          ? item === "expense"
                            ? "#ef4444"
                            : "#10b981"
                          : isDarkMode
                          ? "#9ca3af"
                          : "#6b7280"
                      }
                    />
                    <Text
                      className={`mt-1 font-medium ${
                        type === item
                          ? item === "expense"
                            ? "text-red-600"
                            : "text-green-600"
                          : isDarkMode
                          ? "text-gray-300"
                          : "text-gray-600"
                      }`}
                    >
                      {item === "expense" ? "Chi tiêu" : "Thu nhập"}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Ngày */}
          <View className="mb-6">
            <Text
              className={`text-lg font-semibold mb-3 ${
                isDarkMode ? "text-white" : "text-gray-800"
              }`}
            >
              Ngày giao dịch
            </Text>
            <TouchableOpacity
              onPress={() => setShowDatePicker(true)}
              className={`border rounded-lg px-3 py-3 ${
                isDarkMode
                  ? "bg-gray-700 border-gray-600"
                  : "bg-white border-gray-300"
              }`}
            >
              <Text
                className={`${isDarkMode ? "text-white" : "text-gray-900"}`}
              >
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

          {/* Số tiền */}
          <View className="mb-6">
            <Text
              className={`text-lg font-semibold mb-3 ${
                isDarkMode ? "text-white" : "text-gray-800"
              }`}
            >
              Số tiền
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
                placeholder="Nhập số tiền"
                placeholderTextColor={isDarkMode ? "#9ca3af" : "#9ca3af"}
                keyboardType="numeric"
                className={`flex-1 text-lg ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              />
              <Text
                className={`${isDarkMode ? "text-gray-300" : "text-gray-600"}`}
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
              Mô tả
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
                placeholder="Nhập mô tả giao dịch"
                placeholderTextColor={isDarkMode ? "#9ca3af" : "#9ca3af"}
                multiline
                numberOfLines={3}
                className={`${isDarkMode ? "text-white" : "text-gray-900"}`}
              />
            </View>
          </View>

          {/* Danh mục */}
          <View className="mb-6">
            <Text
              className={`text-lg font-semibold mb-3 ${
                isDarkMode ? "text-white" : "text-gray-800"
              }`}
            >
              Danh mục
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="flex-row"
            >
              {categories
                .filter((cat) => cat.type === type)
                .map((category) => (
                  <TouchableOpacity
                    key={category.id}
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
                      >
                        <Icon
                          name={category.icon}
                          size={18}
                          className={category.iconColor}
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

          {/* Nút lưu */}
          <TouchableOpacity
            onPress={handleSave}
            disabled={loading}
            className="mt-6"
          >
            <LinearGradient
              colors={
                isDarkMode ? ["#d7d2cc", "#304352"] : ["#667eea", "#764ba2"]
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              className="rounded-lg py-4 items-center"
            >
              <Text className="text-white text-lg font-semibold">
                {loading ? "Đang lưu..." : "Lưu giao dịch"}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default AddTransactionScreen;
