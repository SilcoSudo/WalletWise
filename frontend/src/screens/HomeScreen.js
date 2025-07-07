import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  Dimensions,
  TouchableWithoutFeedback,
  Animated,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";
import { LinearGradient } from "expo-linear-gradient";
import { formatCurrency } from "../utils/format";
import { useCategories } from "../hooks/useCategories";
import CategoryBadge from "../components/CategoryBadge";
import TransactionCard from "../components/TransactionCard";
import { useTransactionsContext } from "../hooks/useTransactions";

const HomeScreen = ({
  isDarkMode = false,
  onViewAllTransactions,
  onAddTransaction,
}) => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [modalCategory, setModalCategory] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [categoryTab, setCategoryTab] = useState("expense"); // State cho tab chi tiêu/thu nhập
  const [modalTransactionsLimit, setModalTransactionsLimit] = useState(10);
  const [showBalance, setShowBalance] = useState(false); // Mặc định ẩn

  const selectedDate = new Date();
  const { transactions, stats, loading, error } = useTransactionsContext();
  const {
    categories,
    loading: loadingCategories,
    error: errorCategories,
  } = useCategories();

  // Đếm số giao dịch cho từng category
  const categoryUsage = {};
  transactions.forEach((t) => {
    categoryUsage[t.category] = (categoryUsage[t.category] || 0) + 1;
  });

  const filteredTransactions = selectedCategory
    ? transactions.filter((t) => t.category === selectedCategory)
    : transactions;
  const recentTransactions = filteredTransactions.slice(0, 10);

  const CATEGORIES_PER_ROW = 4;
  const MAX_CATEGORIES = 8;

  let displayedCategories = [];
  if (!showAllCategories) {
    // Sắp xếp theo số giao dịch giảm dần
    displayedCategories = [...categories]
      .sort((a, b) => (categoryUsage[b._id] || 0) - (categoryUsage[a._id] || 0))
      .slice(0, MAX_CATEGORIES);
  } else {
    displayedCategories = categories;
  }

  function renderCategoryRows(list) {
    const rows = [];
    for (let i = 0; i < list.length; i += CATEGORIES_PER_ROW) {
      rows.push(list.slice(i, i + CATEGORIES_PER_ROW));
    }
    return rows.map((row, rowIndex) => (
      <View
        key={rowIndex}
        className="flex-row mb-2"
        style={{
          justifyContent: "space-between",
        }}
      >
        {row.map((category) => (
          <TouchableOpacity
            key={category._id}
            className="items-center mb-4"
            style={{ width: 64 }}
            onPress={() => {
              setModalCategory(category);
              slideAnim.setValue(Dimensions.get("window").height); // Đặt lại vị trí trước
              setModalVisible(true); // Sau đó mới mở modal
              setTimeout(() => {
                Animated.timing(slideAnim, {
                  toValue: 0,
                  duration: 200,
                  useNativeDriver: true,
                }).start();
              }, 10); // Đợi modal render xong mới animate (tránh nhảy)
            }}
          >
            <View
              className={`w-12 h-12 rounded-full items-center justify-center mb-2 ${
                selectedCategory === category._id
                  ? "border-4 border-blue-400"
                  : ""
              }`}
              style={{ backgroundColor: category.bgColor || "#f3f4f6" }}
            >
              <Icon
                name={category.icon}
                size={22}
                color={category.color || "#374151"}
              />
            </View>
            <Text
              className="text-xs text-center text-gray-600"
              numberOfLines={2}
            >
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
        {row.length < CATEGORIES_PER_ROW &&
          Array.from({ length: CATEGORIES_PER_ROW - row.length }).map(
            (_, idx) => (
              <View
                key={`empty-${idx}`}
                style={{ width: 64 }}
                className="mb-4"
              />
            )
          )}
      </View>
    ));
  }

  const expenseCategories = showAllCategories
    ? categories.filter((c) => c.type === "expense")
    : displayedCategories.filter((c) => c.type === "expense");
  const incomeCategories = showAllCategories
    ? categories.filter((c) => c.type === "income")
    : displayedCategories.filter((c) => c.type === "income");

  const slideAnim = useRef(
    new Animated.Value(Dimensions.get("window").height)
  ).current;

  const closeModal = () => {
    Animated.timing(slideAnim, {
      toValue: Dimensions.get("window").height,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setModalVisible(false);
      setModalCategory(null);
      setModalTransactionsLimit(10); // reset khi đóng modal
    });
  };

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpense;

  if (loading && transactions.length === 0) {
    return (
      <View
        className={`flex-1 justify-center items-center ${
          isDarkMode ? "bg-gray-900" : "bg-gray-50"
        }`}
      >
        <ActivityIndicator size="large" color="#667eea" />
        <Text className={`mt-4 ${isDarkMode ? "text-white" : "text-gray-600"}`}>
          Đang tải dữ liệu...
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View
        className={`flex-1 justify-center items-center p-4 ${
          isDarkMode ? "bg-gray-900" : "bg-gray-50"
        }`}
      >
        <Icon name="exclamation-triangle" size={48} color="#ef4444" />
        <Text
          className={`text-lg font-semibold mt-4 text-center ${
            isDarkMode ? "text-white" : "text-gray-800"
          }`}
        >
          Lỗi tải dữ liệu
        </Text>
        <Text
          className={`text-sm text-center mt-2 ${
            isDarkMode ? "text-gray-400" : "text-gray-600"
          }`}
        >
          {error}
        </Text>
      </View>
    );
  }

  return (
    <>
      <ScrollView
        className={`flex-1 ${isDarkMode ? "bg-gray-900" : "bg-gray-50"}`}
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
              <TouchableOpacity onPress={() => setShowBalance((v) => !v)}>
                <Icon
                  name={showBalance ? "eye" : "eye-slash"}
                  size={16}
                  color="white"
                />
              </TouchableOpacity>
            </View>

            <Text className="text-3xl font-bold text-white mb-2">
              {showBalance ? formatCurrency(balance) : "*****"}
            </Text>

            <View className="flex-row justify-between">
              <View className="items-center">
                <Icon name="arrow-down" size={16} color="#10b981" />
                <Text className="text-white/80 text-xs mt-1">Thu nhập</Text>
                <Text className="text-white font-medium">
                  {showBalance ? formatCurrency(totalIncome) : "*****"}
                </Text>
              </View>
              <View className="items-center">
                <Icon name="arrow-up" size={16} color="#ef4444" />
                <Text className="text-white/80 text-xs mt-1">Chi tiêu</Text>
                <Text className="text-white font-medium">
                  {showBalance ? formatCurrency(totalExpense) : "*****"}
                </Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Categories */}
        <View className="px-4 mb-6">
          {showAllCategories ? (
            <>
              {/* Tabs */}
              <View style={{ flexDirection: "row", marginBottom: 12 }}>
                <TouchableOpacity
                  style={{
                    flex: 1,
                    paddingVertical: 10,
                    borderBottomWidth: 3,
                    borderBottomColor:
                      categoryTab === "expense" ? "#ef4444" : "transparent",
                    alignItems: "center",
                    flexDirection: "row",
                    justifyContent: "center",
                    gap: 6,
                    backgroundColor:
                      categoryTab === "expense"
                        ? isDarkMode
                          ? "#3f232a"
                          : "#fee2e2" // đỏ nhạt khi active
                        : "transparent",
                    borderTopLeftRadius: 12,
                    borderBottomLeftRadius: 12,
                  }}
                  onPress={() => setCategoryTab("expense")}
                >
                  <Icon
                    name="arrow-up"
                    size={16}
                    color={categoryTab === "expense" ? "#ef4444" : "#888"}
                    style={{ marginRight: 6 }}
                  />
                  <Text
                    style={{
                      color:
                        categoryTab === "expense"
                          ? isDarkMode
                            ? "#ef4444"
                            : "#b91c1c"
                          : isDarkMode
                          ? "#888"
                          : "#888",
                      fontWeight: "bold",
                      fontSize: 16,
                    }}
                  >
                    Chi tiêu
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    flex: 1,
                    paddingVertical: 10,
                    borderBottomWidth: 3,
                    borderBottomColor:
                      categoryTab === "income" ? "#10b981" : "transparent",
                    alignItems: "center",
                    flexDirection: "row",
                    justifyContent: "center",
                    gap: 6,
                    backgroundColor:
                      categoryTab === "income"
                        ? isDarkMode
                          ? "#1e3a2f"
                          : "#d1fae5" // xanh nhạt khi active
                        : "transparent",
                    borderTopRightRadius: 12,
                    borderBottomRightRadius: 12,
                  }}
                  onPress={() => setCategoryTab("income")}
                >
                  <Icon
                    name="arrow-down"
                    size={16}
                    color={categoryTab === "income" ? "#10b981" : "#888"}
                    style={{ marginRight: 6 }}
                  />
                  <Text
                    style={{
                      color:
                        categoryTab === "income"
                          ? isDarkMode
                            ? "#10b981"
                            : "#047857"
                          : isDarkMode
                          ? "#888"
                          : "#888",
                      fontWeight: "bold",
                      fontSize: 16,
                    }}
                  >
                    Thu nhập
                  </Text>
                </TouchableOpacity>
              </View>
              {/* Danh mục theo tab */}
              {categoryTab === "expense"
                ? renderCategoryRows(
                    categories.filter((c) => c.type === "expense")
                  )
                : renderCategoryRows(
                    categories.filter((c) => c.type === "income")
                  )}
              <View style={{ alignItems: "center", marginTop: 8 }}>
                <TouchableOpacity
                  style={{
                    paddingHorizontal: 24,
                    paddingVertical: 8,
                    borderRadius: 16,
                    backgroundColor: isDarkMode ? "#374151" : "#e0e7ff",
                  }}
                  onPress={() => setShowAllCategories(false)}
                  activeOpacity={0.7}
                >
                  <Text className="text-blue-600 text-sm font-semibold">
                    Thu gọn
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <>
              <Text
                className={`text-lg font-bold mb-3 flex-row items-center ${
                  isDarkMode ? "text-indigo-200" : "text-indigo-700"
                }`}
                style={{
                  letterSpacing: 0.5,
                  display: "flex",
                  alignItems: "center",
                  borderBottomWidth: 2,
                  borderBottomColor: isDarkMode ? "#a5b4fc" : "#667eea", // màu chủ đạo
                  paddingBottom: 4,
                  paddingTop: 11,
                }}
              >
                <Icon
                  name="star"
                  size={18}
                  color="#667eea" // màu chủ đạo
                  style={{ marginRight: 8, marginBottom: -2 }}
                />{" "}
                Danh mục thường dùng
              </Text>
              {renderCategoryRows(displayedCategories)}
              {categories.length > MAX_CATEGORIES && (
                <View style={{ alignItems: "center", marginTop: 8 }}>
                  <TouchableOpacity
                    style={{
                      paddingHorizontal: 24,
                      paddingVertical: 8,
                      borderRadius: 16,
                      backgroundColor: isDarkMode ? "#374151" : "#e0e7ff",
                    }}
                    onPress={() => setShowAllCategories(true)}
                    activeOpacity={0.7}
                  >
                    <Text className="text-blue-600 text-sm font-semibold">
                      Xem thêm
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </>
          )}
        </View>

        {/* Recent Transactions */}
        <View className="px-4 mb-20">
          <View className="flex-row items-center justify-between mb-3">
            <Text
              className={`text-lg font-semibold ${
                isDarkMode ? "text-white" : "text-gray-800"
              }`}
            >
              {selectedCategory
                ? `Giao dịch - ${
                    categories.find((c) => c._id === selectedCategory)?.name ||
                    ""
                  }`
                : "Giao dịch gần đây"}
            </Text>
            <TouchableOpacity onPress={onViewAllTransactions}>
              <Text className="text-blue-600 text-sm">Xem tất cả</Text>
            </TouchableOpacity>
          </View>

          {recentTransactions.length === 0 ? (
            <View className="items-center py-8">
              <Icon
                name="receipt"
                size={48}
                color={isDarkMode ? "#6b7280" : "#d1d5db"}
              />
              <Text
                className={`text-lg font-medium mt-4 ${
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Chưa có giao dịch nào
              </Text>
              <Text
                className={`text-sm text-center mt-2 ${
                  isDarkMode ? "text-gray-500" : "text-gray-400"
                }`}
              >
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

      {/* Modal danh mục */}
      <Modal
        visible={modalVisible}
        animationType="none"
        transparent={true}
        onRequestClose={closeModal}
      >
        <TouchableWithoutFeedback onPress={closeModal}>
          <View
            style={{
              flex: 1,
              backgroundColor: "rgba(0,0,0,0.3)",
              justifyContent: "flex-end",
            }}
          >
            <Animated.View
              style={{
                backgroundColor: isDarkMode ? "#1f2937" : "#fff",
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
                maxHeight: "80%",
                padding: 16,
                transform: [{ translateY: slideAnim }],
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "bold",
                  color: isDarkMode ? "#fff" : "#222",
                  marginBottom: 12,
                }}
              >
                {modalCategory?.name}
              </Text>
              <TouchableOpacity
                style={{ position: "absolute", right: 16, top: 16 }}
                onPress={closeModal}
              >
                <Icon name="times" size={22} color="#888" />
              </TouchableOpacity>
              <ScrollView style={{ marginTop: 24 }}>
                {(() => {
                  const modalTransactions = transactions
                    .filter((t) => t.category === modalCategory?._id)
                    .sort((a, b) => new Date(b.date) - new Date(a.date));
                  if (modalTransactions.length === 0) {
                    return (
                      <View className="items-center py-8">
                        <Icon
                          name="receipt"
                          size={48}
                          color={isDarkMode ? "#6b7280" : "#d1d5db"}
                        />
                        <Text
                          className={`text-lg font-medium mt-4 ${
                            isDarkMode ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          Chưa có giao dịch nào
                        </Text>
                        <Text
                          className={`text-sm text-center mt-2 ${
                            isDarkMode ? "text-gray-500" : "text-gray-400"
                          }`}
                        >
                          Thêm giao dịch đầu tiên cho danh mục này để bắt đầu
                          theo dõi chi tiêu
                        </Text>
                      </View>
                    );
                  }
                  return (
                    <>
                      {modalTransactions
                        .slice(0, modalTransactionsLimit)
                        .map((transaction) => (
                          <TransactionCard
                            key={transaction._id}
                            transaction={transaction}
                            isDarkMode={isDarkMode}
                          />
                        ))}
                      {modalTransactionsLimit < modalTransactions.length && (
                        <View style={{ alignItems: "center", marginTop: 12 }}>
                          <TouchableOpacity
                            style={{
                              paddingHorizontal: 24,
                              paddingVertical: 8,
                              borderRadius: 16,
                              backgroundColor: isDarkMode
                                ? "#374151"
                                : "#e0e7ff",
                            }}
                            onPress={() =>
                              setModalTransactionsLimit(
                                modalTransactionsLimit + 10
                              )
                            }
                            activeOpacity={0.7}
                          >
                            <Text className="text-blue-600 text-sm font-semibold">
                              Tải thêm
                            </Text>
                          </TouchableOpacity>
                        </View>
                      )}
                    </>
                  );
                })()}
              </ScrollView>
            </Animated.View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
};

export default HomeScreen;
