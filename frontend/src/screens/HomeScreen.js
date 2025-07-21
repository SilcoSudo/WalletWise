import React, { useState, useRef, useEffect } from "react"; // Thư viện React và các hook quản lý state, ref, effect
import {
  View, // Container layout
  Text, // Hiển thị text
  ScrollView, // Scroll nội dung
  TouchableOpacity, // Button cảm ứng
  ActivityIndicator, // Loading spinner
  Modal, // Modal popup
  Dimensions, // Lấy kích thước màn hình
  TouchableWithoutFeedback, // Bắt sự kiện chạm ngoài modal
  Animated, // Hiệu ứng chuyển động
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5"; // Icon FontAwesome5 cho UI
import { LinearGradient } from "expo-linear-gradient"; // Gradient cho card số dư
import { formatCurrency } from "../utils/format"; // Hàm format số tiền
import { useCategories } from "../hooks/useCategories"; // Hook lấy danh mục từ API/backend
import CategoryBadge from "../components/CategoryBadge"; // Component hiển thị badge danh mục (không dùng trực tiếp ở đây)
import TransactionCard from "../components/TransactionCard"; // Component hiển thị 1 giao dịch
import { useTransactionsContext } from "../hooks/useTransactions"; // Hook lấy danh sách giao dịch từ API/backend

const HomeScreen = ({
  isDarkMode = false, // Chế độ tối cho UI
  onViewAllTransactions, // Hàm callback khi bấm "Xem tất cả giao dịch"
  onAddTransaction, // Hàm callback khi thêm giao dịch mới
  navigation, // Đối tượng điều hướng giữa các màn hình
}) => {
  const [selectedCategory, setSelectedCategory] = useState(null); // Lưu danh mục đang được chọn để lọc giao dịch
  const [showAllCategories, setShowAllCategories] = useState(false); // Hiển thị tất cả danh mục hay chỉ thường dùng
  const [modalCategory, setModalCategory] = useState(null); // Danh mục đang mở modal chi tiết
  const [modalVisible, setModalVisible] = useState(false); // Trạng thái hiển thị modal chi tiết danh mục
  const [categoryTab, setCategoryTab] = useState("expense"); // Tab đang chọn: chi tiêu hay thu nhập
  const [modalTransactionsLimit, setModalTransactionsLimit] = useState(10); // Số giao dịch hiển thị trong modal
  const [showBalance, setShowBalance] = useState(false); // Ẩn/hiện số dư tài khoản

  const selectedDate = new Date(); // Ngày hiện tại (không dùng trực tiếp)
  const { transactions, stats, loading, error } = useTransactionsContext();
  const {
    categories,
    loading: loadingCategories,
    error: errorCategories,
  } = useCategories();

  // ================== PHẦN LOGIC VÀ HIỂN THỊ ==================
  // Đếm số giao dịch cho từng category để xác định danh mục thường dùng
  const categoryUsage = {};
  transactions.forEach((t) => {
    // Tăng số lượng giao dịch cho từng category
    categoryUsage[t.category] = (categoryUsage[t.category] || 0) + 1;
  });

  // Lọc giao dịch theo danh mục được chọn (nếu có), nếu không thì lấy tất cả
  const filteredTransactions = selectedCategory
    ? transactions.filter((t) => t.category === selectedCategory)
    : transactions;
  // Lấy 10 giao dịch gần nhất sau khi lọc
  const recentTransactions = filteredTransactions.slice(0, 10);

  // Số lượng danh mục hiển thị trên mỗi hàng
  const CATEGORIES_PER_ROW = 4;
  // Số lượng danh mục tối đa hiển thị khi không mở rộng
  const MAX_CATEGORIES = 8;

  // Mảng danh mục sẽ hiển thị (thường dùng hoặc tất cả)
  let displayedCategories = [];
  if (!showAllCategories) {
    // Nếu không mở rộng, sắp xếp danh mục theo số giao dịch giảm dần và lấy tối đa MAX_CATEGORIES
    displayedCategories = [...categories]
      .sort(
        (a, b) => (categoryUsage[b.name] || 0) - (categoryUsage[a.name] || 0)
      )
      .slice(0, MAX_CATEGORIES);
  } else {
    // Nếu mở rộng, hiển thị tất cả danh mục
    displayedCategories = categories;
  }

  // Hàm render các hàng danh mục, mỗi hàng có tối đa CATEGORIES_PER_ROW danh mục
  function renderCategoryRows(list) {
    const rows = [];
    // Chia danh mục thành các hàng
    for (let i = 0; i < list.length; i += CATEGORIES_PER_ROW) {
      rows.push(list.slice(i, i + CATEGORIES_PER_ROW));
    }
    // Render từng hàng
    return rows.map((row, rowIndex) => (
      <View
        key={rowIndex}
        className="flex-row mb-2"
        style={{
          justifyContent: "space-between",
        }}
      >
        {/* Render từng danh mục trong hàng */}
        {row.map((category) => (
          <TouchableOpacity
            key={category._id}
            className="items-center mb-4"
            style={{ width: 64 }}
            onPress={() => {
              // Khi bấm vào danh mục, mở modal chi tiết danh mục
              setModalCategory(category);
              // Đặt lại vị trí modal trước khi animate
              slideAnim.setValue(Dimensions.get("window").height);
              setModalVisible(true);
              // Đợi modal render xong rồi animate slide lên
              setTimeout(() => {
                Animated.timing(slideAnim, {
                  toValue: 0,
                  duration: 200,
                  useNativeDriver: true,
                }).start();
              }, 10);
            }}
          >
            {/* Vòng tròn icon danh mục */}
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
            {/* Tên danh mục */}
            <Text
              className="text-xs text-center text-gray-600"
              numberOfLines={2}
            >
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
        {/* Nếu hàng chưa đủ số lượng, thêm các ô trống để căn đều */}
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

  // Lấy danh mục chi tiêu và thu nhập theo tab và trạng thái mở rộng
  const expenseCategories = showAllCategories
    ? categories.filter((c) => c.type === "expense")
    : displayedCategories.filter((c) => c.type === "expense");
  const incomeCategories = showAllCategories
    ? categories.filter((c) => c.type === "income")
    : displayedCategories.filter((c) => c.type === "income");

  // Biến animation cho modal danh mục (slide lên/xuống)
  const slideAnim = useRef(
    new Animated.Value(Dimensions.get("window").height)
  ).current;

  // Hàm đóng modal danh mục, reset lại các state liên quan
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

  // Tính tổng thu nhập từ các giao dịch
  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  // Tính tổng chi tiêu từ các giao dịch
  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  // Tính số dư hiện tại
  const balance = totalIncome - totalExpense;

  // ================== PHẦN HIỂN THỊ UI ==================
  // Nếu đang loading và chưa có giao dịch, hiển thị spinner và thông báo
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

  // Nếu có lỗi, hiển thị thông báo lỗi
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

  // ================== PHẦN RETURN JSX ==================
  return (
    <>
      <ScrollView
        className={`flex-1 ${isDarkMode ? "bg-gray-900" : "bg-gray-50"}`}
        showsVerticalScrollIndicator={false}
      >
        {/* Balance Card */}
        <View className="p-4">
          <LinearGradient
            colors={
              isDarkMode ? ["#5ee7df", "#b490ca"] : ["#a8edea", "#fed6e3"]
            }
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="rounded-2xl p-6 shadow-lg"
          >
            <View className="flex-row items-center justify-between mb-4">
              <Text
                className="text-sm"
                style={{ color: isDarkMode ? "#ffffff" : "#374151" }}
              >
                Số dư hiện tại
              </Text>
              <TouchableOpacity onPress={() => setShowBalance((v) => !v)}>
                <Icon
                  name={showBalance ? "eye" : "eye-slash"}
                  size={16}
                  color={isDarkMode ? "#ffffff" : "#374151"}
                />
              </TouchableOpacity>
            </View>

            <Text
              className="text-3xl font-bold mb-2"
              style={{ color: isDarkMode ? "#ffffff" : "#374151" }}
            >
              {showBalance ? formatCurrency(balance) : "*****"}
            </Text>

            <View className="flex-row justify-between">
              <View className="items-center">
                <Icon name="arrow-down" size={16} color="#10b981" />
                <Text
                  className="text-xs mt-1"
                  style={{ color: isDarkMode ? "#ffffff" : "#374151" }}
                >
                  Thu nhập
                </Text>
                <Text
                  className="font-medium"
                  style={{ color: isDarkMode ? "#ffffff" : "#374151" }}
                >
                  {showBalance ? formatCurrency(totalIncome) : "*****"}
                </Text>
              </View>
              <View className="items-center">
                <Icon name="arrow-up" size={16} color="#ef4444" />
                <Text
                  className="text-xs mt-1"
                  style={{ color: isDarkMode ? "#ffffff" : "#374151" }}
                >
                  Chi tiêu
                </Text>
                <Text
                  className="font-medium"
                  style={{ color: isDarkMode ? "#ffffff" : "#374151" }}
                >
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
              {/* Header với nút Quản lý khi xem tất cả */}
              <View className="flex-row items-end justify-between mb-3">
                <Text
                  className={`text-lg font-semibold ${
                    isDarkMode ? "text-indigo-200" : "text-indigo-700"
                  }`}
                  style={{
                    letterSpacing: 0.5,
                    display: "flex",
                    alignItems: "center",
                    borderBottomWidth: 2,
                    borderBottomColor: isDarkMode ? "#a5b4fc" : "#667eea",
                    paddingBottom: 4,
                    paddingTop: 11,
                  }}
                >
                  <Icon
                    name="list"
                    size={18}
                    color="#667eea"
                    style={{ marginRight: 8, marginBottom: -2 }}
                  />{" "}
                  Tất cả danh mục
                </Text>
                <TouchableOpacity
                  onPress={() => navigation?.navigate("categories")}
                  style={{
                    paddingHorizontal: 14,
                    paddingVertical: 6,
                    marginBottom: 2,
                    backgroundColor: isDarkMode ? "#374151" : "#f8fafc",
                    borderRadius: 8,
                    borderWidth: 1,
                    borderColor: isDarkMode ? "#6b7280" : "#e2e8f0",
                    flexDirection: "row",
                    alignItems: "center",
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.1,
                    shadowRadius: 2,
                    elevation: 2,
                  }}
                  activeOpacity={0.7}
                >
                  <Icon
                    name="cog"
                    size={13}
                    color={isDarkMode ? "#9ca3af" : "#667eea"}
                    style={{ marginRight: 5 }}
                  />
                  <Text
                    style={{
                      fontSize: 13,
                      fontWeight: "600",
                      color: isDarkMode ? "#d1d5db" : "#667eea",
                    }}
                  >
                    Quản lý
                  </Text>
                </TouchableOpacity>
              </View>
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
              <View className="flex-row items-end justify-between mb-2">
                <Text
                  className={`text-lg font-semibold ${
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
                <TouchableOpacity
                  onPress={() => navigation?.navigate("categories")}
                  style={{
                    paddingHorizontal: 14,
                    paddingVertical: 6,
                    marginBottom: 2,
                    backgroundColor: isDarkMode ? "#374151" : "#f8fafc",
                    borderRadius: 8,
                    borderWidth: 1,
                    borderColor: isDarkMode ? "#6b7280" : "#e2e8f0",
                    flexDirection: "row",
                    alignItems: "center",
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.1,
                    shadowRadius: 2,
                    elevation: 2,
                  }}
                  activeOpacity={0.7}
                >
                  <Icon
                    name="cog"
                    size={13}
                    color={isDarkMode ? "#9ca3af" : "#667eea"}
                    style={{ marginRight: 5 }}
                  />
                  <Text
                    style={{
                      fontSize: 13,
                      fontWeight: "600",
                      color: isDarkMode ? "#d1d5db" : "#667eea",
                    }}
                  >
                    Quản lý
                  </Text>
                </TouchableOpacity>
              </View>
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
                ? `Giao dịch - ${selectedCategory}`
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
        statusBarTranslucent={true}
      >
        <TouchableWithoutFeedback onPress={closeModal}>
          <View
            style={{
              flex: 1,
              backgroundColor: "rgba(0,0,0,0.5)",
              justifyContent: "flex-end",
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              width: "100%",
              height: "100%",
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
                    .filter((t) => t.category === modalCategory?.name)
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
