import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Icon from "react-native-vector-icons/FontAwesome5";
import { LinearGradient } from "expo-linear-gradient";
import { categoriesAPI } from "../utils/api";
import { useCategories } from "../hooks/useCategories";

const CategoriesScreen = ({ navigation }) => {
  const { categories, loading, error, refreshCategories } = useCategories();

  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [activeTab, setActiveTab] = useState("expense");
  const [formData, setFormData] = useState({
    name: "",
    type: "expense",
    icon: "utensils",
    color: "#374151",
    bgColor: "#f3f4f6",
  });

  const expenseIcons = [
    "utensils",
    "coffee",
    "car",
    "bus",
    "motorcycle",
    "bicycle",
    "home",
    "shopping-cart",
    "tshirt",
    "gamepad",
    "film",
    "music",
    "pills",
    "heartbeat",
    "dumbbell",
    "graduation-cap",
    "book",
    "pencil-alt",
    "camera",
    "mobile",
    "laptop",
    "headphones",
    "paint-brush",
    "cut",
    "hammer",
    "wrench",
    "gas-pump",
    "tools",
    "fire",
    "leaf",
    "paw",
    "cat",
    "dog",
    "pizza-slice",
    "ice-cream",
    "wine-glass",
    "smoking",
    "first-aid",
    "tooth",
    "eye",
  ];

  const incomeIcons = [
    "dollar-sign",
    "money-bill-wave",
    "credit-card",
    "wallet",
    "coins",
    "piggy-bank",
    "chart-line",
    "chart-bar",
    "briefcase",
    "building",
    "store",
    "gift",
    "award",
    "trophy",
    "medal",
    "star",
    "crown",
    "gem",
    "lightbulb",
    "rocket",
    "handshake",
    "user-tie",
    "graduation-cap",
    "scroll",
    "university",
    "landmark",
    "globe",
    "wifi",
    "laptop",
    "mobile-alt",
    "tablet-alt",
    "desktop",
  ];

  const categoryColors = [
    "#ef4444", // red
    "#f97316", // orange
    "#eab308", // yellow
    "#22c55e", // green
    "#10b981", // emerald
    "#06b6d4", // cyan
    "#3b82f6", // blue
    "#6366f1", // indigo
    "#8b5cf6", // violet
    "#a855f7", // purple
    "#d946ef", // fuchsia
    "#ec4899", // pink
    "#f43f5e", // rose
    "#84cc16", // lime
    "#059669", // teal
    "#0891b2", // sky
    "#7c3aed", // purple
    "#db2777", // pink
    "#dc2626", // red
    "#ca8a04", // amber
  ];

  const categoryTypes = [
    { value: "expense", label: "Chi tiêu", color: "#ef4444" },
    { value: "income", label: "Thu nhập", color: "#22c55e" },
  ];

  useEffect(() => {
    // Categories sẽ được load tự động thông qua useCategories hook
  }, []);

  const handleSave = async () => {
    try {
      if (!formData.name.trim()) {
        Alert.alert("Lỗi", "Vui lòng nhập tên danh mục");
        return;
      }

      if (editingCategory) {
        // Update existing category
        await categoriesAPI.update(editingCategory._id, formData);
        Alert.alert("Thành công", "Đã cập nhật danh mục");
      } else {
        // Create new category
        await categoriesAPI.create(formData);
        Alert.alert("Thành công", "Đã tạo danh mục mới");
      }

      setShowModal(false);
      setEditingCategory(null);
      setFormData({
        name: "",
        type: "expense",
        icon: "utensils",
        color: "#374151",
        bgColor: "#f3f4f6",
      });
      refreshCategories(); // Refresh categories thông qua hook
    } catch (error) {
      Alert.alert("Lỗi", "Không thể lưu danh mục");
      console.error("Save category error:", error);
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      type: category.type,
      icon: category.icon,
      color: category.color || "#374151",
      bgColor: category.bgColor || "#f3f4f6",
    });
    setShowModal(true);
  };

  const handleDelete = (category) => {
    Alert.alert(
      "Xác nhận xóa",
      `Bạn có chắc muốn xóa danh mục "${category.name}"?`,
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Xóa",
          style: "destructive",
          onPress: async () => {
            try {
              await categoriesAPI.delete(category._id);
              Alert.alert("Thành công", "Đã xóa danh mục");
              refreshCategories(); // Refresh categories thông qua hook
            } catch (error) {
              Alert.alert("Lỗi", "Không thể xóa danh mục");
              console.error("Delete category error:", error);
            }
          },
        },
      ]
    );
  };

  const openCreateModal = () => {
    setEditingCategory(null);
    // Get icons for current tab type
    const currentIcons = activeTab === "expense" ? expenseIcons : incomeIcons;
    // Get available icons (not used by existing categories of same type)
    const usedIconsForType = categories
      .filter((cat) => cat.type === activeTab)
      .map((cat) => cat.icon);
    const availableIconsForType = currentIcons.filter(
      (icon) => !usedIconsForType.includes(icon)
    );

    // Set default icon to first available icon
    const defaultIcon =
      availableIconsForType.length > 0
        ? availableIconsForType[0]
        : currentIcons[0];
    const defaultColor = activeTab === "expense" ? "#ef4444" : "#22c55e";
    const defaultBgColor = activeTab === "expense" ? "#fee2e2" : "#dcfce7";

    setFormData({
      name: "",
      type: activeTab,
      icon: defaultIcon,
      color: defaultColor,
      bgColor: defaultBgColor,
    });
    setShowModal(true);
  };

  // Filter categories based on active tab
  const filteredCategories = categories
    .filter((category) => category.type === activeTab)
    .sort((a, b) => {
      // Sắp xếp: categories có thể edit lên đầu, không edit xuống cuối
      const aEditable = a.editable !== false && a.deletable !== false;
      const bEditable = b.editable !== false && b.deletable !== false;
      
      if (aEditable && !bEditable) return -1; // a lên đầu
      if (!aEditable && bEditable) return 1;  // b lên đầu
      return 0; // giữ nguyên thứ tự nếu cùng loại
    });

  // Get available icons (exclude icons already used by existing categories)
  const getCurrentIcons = () => {
    return formData.type === "expense" ? expenseIcons : incomeIcons;
  };

  const getAvailableIcons = () => {
    const currentIcons = getCurrentIcons();
    const usedIconsForType = categories
      .filter((cat) => cat.type === formData.type)
      .map((cat) => cat.icon);
    return currentIcons.filter((icon) => !usedIconsForType.includes(icon));
  };

  const renderCategoryItem = ({ item }) => {
    const typeInfo = categoryTypes.find((t) => t.value === item.type);

    return (
      <View
        className="bg-white mx-4 mb-1 rounded-xl"
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.08,
          shadowRadius: 4,
          elevation: 2,
        }}
      >
        <View className="p-4">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center flex-1">
              <View
                className="w-12 h-12 rounded-full items-center justify-center mr-3"
                style={{
                  backgroundColor: item.bgColor || "#f3f4f6",
                }}
              >
                <Icon
                  name={item.icon}
                  size={22}
                  color={item.color || "#374151"}
                />
              </View>

              <View className="flex-1">
                <Text className="text-gray-900 font-semibold text-base">
                  {item.name}
                </Text>
              </View>
            </View>

            <View className="flex-row items-center">
              {/* Chỉ hiển thị nút edit/delete nếu category có thể chỉnh sửa */}
              {item.editable !== false && item.deletable !== false && (
                <>
                  <TouchableOpacity
                    onPress={() => handleEdit(item)}
                    className="p-2 mr-1"
                    style={{
                      backgroundColor: "#f3f4f6",
                      borderRadius: 8,
                    }}
                  >
                    <Ionicons name="pencil" size={18} color="#6b7280" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleDelete(item)}
                    className="p-2"
                    style={{
                      backgroundColor: "#fef2f2",
                      borderRadius: 8,
                    }}
                  >
                    <Ionicons name="trash" size={18} color="#ef4444" />
                  </TouchableOpacity>
                </>
              )}
              {/* Hiển thị icon lock nếu category không thể chỉnh sửa */}
              {(item.editable === false || item.deletable === false) && (
                <View
                  className="p-2"
                  style={{
                    backgroundColor: "#f9fafb",
                    borderRadius: 8,
                  }}
                >
                  <Ionicons name="lock-closed" size={18} color="#9ca3af" />
                </View>
              )}
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white border-b border-gray-200">
        <View className="flex-row items-center justify-between px-4 py-3">
          <TouchableOpacity onPress={() => navigation.goBack()} className="p-2">
            <Ionicons name="arrow-back" size={24} color="#374151" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-gray-900">
            Quản lý danh mục
          </Text>
          <TouchableOpacity onPress={openCreateModal} className="p-2">
            <Ionicons name="add" size={24} color="#3b82f6" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Tab Navigation */}
      <View className="bg-white border-b border-gray-200">
        <View className="flex-row mx-4">
          <TouchableOpacity
            onPress={() => setActiveTab("expense")}
            className={`flex-1 py-3 ${
              activeTab === "expense" ? "border-b-2 border-red-500" : ""
            }`}
          >
            <Text
              className={`text-center font-semibold ${
                activeTab === "expense" ? "text-red-500" : "text-gray-500"
              }`}
            >
              Chi tiêu ({categories.filter((c) => c.type === "expense").length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setActiveTab("income")}
            className={`flex-1 py-3 ${
              activeTab === "income" ? "border-b-2 border-green-500" : ""
            }`}
          >
            <Text
              className={`text-center font-semibold ${
                activeTab === "income" ? "text-green-500" : "text-gray-500"
              }`}
            >
              Thu nhập ({categories.filter((c) => c.type === "income").length})
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Categories List */}
      <FlatList
        data={filteredCategories}
        keyExtractor={(item) => item._id}
        renderItem={renderCategoryItem}
        contentContainerStyle={{ paddingVertical: 16, paddingBottom: 80 }}
        refreshing={loading}
        onRefresh={refreshCategories}
        ListEmptyComponent={
          <View className="items-center justify-center py-20">
            <Ionicons name="folder-open-outline" size={64} color="#9ca3af" />
            <Text className="text-gray-500 text-lg mt-4">
              Chưa có danh mục{" "}
              {activeTab === "expense" ? "chi tiêu" : "thu nhập"} nào
            </Text>
            <TouchableOpacity
              onPress={openCreateModal}
              className="mt-4 bg-blue-500 px-6 py-2 rounded-lg"
            >
              <Text className="text-white font-semibold">
                Tạo danh mục {activeTab === "expense" ? "chi tiêu" : "thu nhập"}{" "}
                đầu tiên
              </Text>
            </TouchableOpacity>
          </View>
        }
      />

      {/* Create/Edit Modal */}
      <Modal
        visible={showModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View className="flex-1 bg-white">
          {/* Modal Header */}
          <View className="border-b border-gray-200">
            <View className="flex-row items-center justify-between px-4 py-4">
              <TouchableOpacity
                onPress={() => setShowModal(false)}
                className="p-2"
              >
                <Text className="text-blue-500 text-base">Hủy</Text>
              </TouchableOpacity>
              <Text className="text-xl font-bold text-gray-900">
                {editingCategory ? "Sửa danh mục" : "Tạo danh mục"}
              </Text>
              <View className="p-2" style={{ width: 44 }}>
                {/* Spacer để căn giữa title */}
              </View>
            </View>
          </View>

          <ScrollView className="flex-1 p-4">
            {/* Category Name */}
            <View className="mb-6">
              <Text className="text-gray-700 font-semibold mb-2">
                Tên danh mục
              </Text>
              <TextInput
                value={formData.name}
                onChangeText={(text) =>
                  setFormData((prev) => ({ ...prev, name: text }))
                }
                placeholder="Nhập tên danh mục"
                className="border border-gray-300 rounded-lg px-4 py-3 text-base"
              />
            </View>

            {/* Category Type - Only show if creating new category */}
            {!editingCategory && (
              <View className="mb-6">
                <Text className="text-gray-700 font-semibold mb-2">
                  Loại danh mục
                </Text>
                <View className="flex-row bg-gray-100 rounded-xl p-1">
                  {categoryTypes.map((type, index) => (
                    <TouchableOpacity
                      key={type.value}
                      onPress={() =>
                        setFormData((prev) => ({ ...prev, type: type.value }))
                      }
                      className={`flex-1 py-3 px-4 rounded-lg ${
                        formData.type === type.value
                          ? type.value === "expense" 
                            ? "bg-red-500 shadow-sm" 
                            : "bg-green-500 shadow-sm"
                          : "bg-transparent"
                      }`}
                      style={{
                        marginRight: index === 0 ? 4 : 0,
                        marginLeft: index === 1 ? 4 : 0,
                        shadowColor: formData.type === type.value 
                          ? (type.value === "expense" ? "#ef4444" : "#22c55e")
                          : "transparent",
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.1,
                        shadowRadius: 4,
                        elevation: formData.type === type.value ? 2 : 0,
                      }}
                    >
                      <Text
                        className={`text-center font-semibold ${
                          formData.type === type.value
                            ? "text-white"
                            : "text-gray-600"
                        }`}
                      >
                        {type.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            {/* Category Icon */}
            <View className="mb-6">
              <Text className="text-gray-700 font-semibold mb-2">
                Biểu tượng
              </Text>
              <View className="flex-row flex-wrap">
                {(editingCategory
                  ? getCurrentIcons()
                  : getAvailableIcons()
                ).map((icon, index) => (
                  <TouchableOpacity
                    key={icon}
                    onPress={() => setFormData((prev) => ({ ...prev, icon }))}
                    className={`rounded-lg items-center justify-center mb-2`}
                    style={{
                      width: "15.5%",
                      height: 48,
                      marginBottom: 8,
                      marginRight: index % 6 === 5 ? 0 : "1.2%",
                      backgroundColor:
                        formData.icon === icon ? "#a8edea" : "#f3f4f6",
                    }}
                  >
                    <Icon
                      name={icon}
                      size={20}
                      color={formData.icon === icon ? "#374151" : "#6b7280"}
                    />
                  </TouchableOpacity>
                ))}
              </View>
              {!editingCategory && getAvailableIcons().length === 0 && (
                <Text className="text-gray-500 text-sm mt-2">
                  Tất cả icon đã được sử dụng. Bạn có thể dùng lại icon đã có.
                </Text>
              )}
              {!editingCategory && getAvailableIcons().length === 0 && (
                <View className="flex-row flex-wrap mt-2">
                  {getCurrentIcons().map((icon, index) => (
                    <TouchableOpacity
                      key={icon}
                      onPress={() => setFormData((prev) => ({ ...prev, icon }))}
                      className={`rounded-lg items-center justify-center border`}
                      style={{
                        width: "15.5%",
                        height: 48,
                        marginBottom: 8,
                        marginRight: index % 6 === 5 ? 0 : "1.2%",
                        backgroundColor:
                          formData.icon === icon ? "#a8edea" : "#f3f4f6",
                        borderColor:
                          formData.icon === icon ? "#a8edea" : "#d1d5db",
                      }}
                    >
                      <Icon
                        name={icon}
                        size={20}
                        color={formData.icon === icon ? "#374151" : "#6b7280"}
                      />
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            {/* Category Color */}
            <View className="mb-6">
              <Text className="text-gray-700 font-semibold mb-2">Màu sắc</Text>
              <View className="flex-row flex-wrap">
                {categoryColors.map((color, index) => (
                  <TouchableOpacity
                    key={color}
                    onPress={() =>
                      setFormData((prev) => ({
                        ...prev,
                        color,
                        bgColor: color + "20", // Add transparency for background
                      }))
                    }
                    className={`w-10 h-10 rounded-full mb-2`}
                    style={{
                      backgroundColor: color,
                      marginRight: index % 7 === 6 ? 0 : 8,
                      borderWidth: formData.color === color ? 4 : 2,
                      borderColor:
                        formData.color === color ? "#a8edea" : "#e5e7eb",
                    }}
                  />
                ))}
              </View>

              {/* Preview */}
              <View className="mt-4 p-4 bg-gray-50 rounded-lg">
                <Text className="text-gray-600 text-sm mb-3">Xem trước:</Text>
                <View className="flex-row items-center">
                  <View
                    className="w-12 h-12 rounded-full items-center justify-center mr-4"
                    style={{ backgroundColor: formData.bgColor }}
                  >
                    <Icon
                      name={formData.icon}
                      size={20}
                      color={formData.color}
                    />
                  </View>
                  <Text className="text-gray-900 font-medium text-base">
                    {formData.name || "Tên danh mục"}
                  </Text>
                </View>
              </View>

              {/* Save Button */}
              <TouchableOpacity onPress={handleSave} className="mt-6 mb-4 mx-8">
                <LinearGradient
                  colors={["#a8edea", "#fed6e3"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  className="rounded-lg py-3 items-center"
                >
                  <Text className="text-gray-800 text-base font-semibold">
                    {editingCategory ? "Cập nhật danh mục" : "Tạo danh mục"}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
};

export default CategoriesScreen;
