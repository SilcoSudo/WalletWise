import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  Modal,
  ScrollView,
  ActivityIndicator,
  Platform,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import Icon from "react-native-vector-icons/FontAwesome5";

// ImgBB Image Uploader Utility
// Note: You need to get a free API key from https://imgbb.com/
const IMGBB_API_KEY = "efaa8a87569e9ec5dbf821f762a1d913"; // Replace with your API key
const IMGBB_API_URL = "https://api.imgbb.com/1/upload";

const uploadImageToImgBB = async (imageUri) => {
  try {
    console.log("[AvatarPicker] Starting upload for:", imageUri);
    
    // Check if API key is configured
    if (IMGBB_API_KEY === "YOUR_IMGBB_API_KEY_HERE") {
      throw new Error("ImgBB API key not configured. Please set your API key in AvatarPicker.js");
    }

    // Optimize image before upload
    const optimizedImageUri = await optimizeImage(imageUri);
    
    // Đọc file thành base64 với timeout
    const base64 = await Promise.race([
      FileSystem.readAsStringAsync(optimizedImageUri, {
        encoding: FileSystem.EncodingType.Base64,
      }),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Read timeout')), 10000)
      )
    ]);
    
    console.log("[AvatarPicker] Base64 length:", base64.length);
    
    // Chuẩn bị payload với timeout
    const formData = new FormData();
    formData.append("key", IMGBB_API_KEY);
    formData.append("image", base64);
    
    // Gửi lên ImgBB với timeout và retry
    const response = await Promise.race([
      fetch(IMGBB_API_URL, {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      }),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Upload timeout')), 15000)
      )
    ]);
    
    console.log("[AvatarPicker] Response status:", response.status);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const result = await response.json();
    
    if (result.success) {
      console.log("[AvatarPicker] Upload successful");
      return {
        url: result.data.url,
        deleteUrl: result.data.delete_url,
        thumbUrl: result.data.thumb?.url,
      };
    } else {
      throw new Error(
        result.error?.message || "Failed to upload image to ImgBB"
      );
    }
  } catch (error) {
    console.log("[AvatarPicker] Upload error:", error.message);
    throw new Error("Upload failed: " + error.message);
  }
};

// Optimize image before upload
const optimizeImage = async (imageUri) => {
  try {
    // For now, return original image
    // In the future, you can add image compression here
    return imageUri;
  } catch (error) {
    console.log("[AvatarPicker] Image optimization failed, using original");
    return imageUri;
  }
};

const AvatarPicker = ({
  currentAvatar,
  onAvatarChange,
  isDarkMode = false,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [uploading, setUploading] = useState(false);

  const predefinedAvatars = [
    { id: 1, uri: "https://emojiapi.dev/api/v1/1f604/128.png" },
    { id: 2, uri: "https://emojiapi.dev/api/v1/1f60a/128.png" }, 
    { id: 3, uri: "https://emojiapi.dev/api/v1/1f60e/128.png" },
    { id: 4, uri: "https://emojiapi.dev/api/v1/1f60d/128.png" }, 
    { id: 5, uri: "https://emojiapi.dev/api/v1/1f618/128.png" }, 
    { id: 6, uri: "https://emojiapi.dev/api/v1/1f609/128.png" },
  ];

  const pickImageFromGallery = async () => {
    try {
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (permissionResult.granted === false) {
        Alert.alert("Lỗi", "Cần cấp quyền truy cập thư viện ảnh");
        return;
      }
      
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5, // Giảm quality để giảm kích thước file
        maxWidth: 512, // Giới hạn kích thước
        maxHeight: 512,
      });
      
      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        
        // Kiểm tra kích thước file
        if (asset.fileSize && asset.fileSize > 2 * 1024 * 1024) { // Giảm từ 5MB xuống 2MB
          Alert.alert("Lỗi", "Kích thước ảnh không được vượt quá 2MB");
          return;
        }
        
        setUploading(true);
        try {
          // Kiểm tra file tồn tại (chỉ Android)
          if (Platform.OS === "android") {
            const fileInfo = await FileSystem.getInfoAsync(asset.uri);
            if (!fileInfo.exists) {
              throw new Error("File không tồn tại hoặc không thể truy cập");
            }
          }
          
          // Upload với timeout
          const imgbbResponse = await Promise.race([
            uploadImageToImgBB(asset.uri),
            new Promise((_, reject) => 
              setTimeout(() => reject(new Error('Upload timeout')), 20000)
            )
          ]);
          
          onAvatarChange(imgbbResponse.url);
          setModalVisible(false);
        } catch (uploadError) {
          Alert.alert(
            "Lỗi",
            uploadError.message ||
              "Không thể tải ảnh lên. Vui lòng thử lại sau."
          );
        } finally {
          setUploading(false);
        }
      }
    } catch (error) {
      Alert.alert("Lỗi", "Không thể chọn ảnh");
    }
  };

  const takePhoto = async () => {
    try {
      const permissionResult =
        await ImagePicker.requestCameraPermissionsAsync();
      if (permissionResult.granted === false) {
        Alert.alert("Lỗi", "Cần cấp quyền truy cập camera");
        return;
      }
      
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5, // Giảm quality để giảm kích thước file
        maxWidth: 512, // Giới hạn kích thước
        maxHeight: 512,
      });
      
      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        
        // Kiểm tra kích thước file
        if (asset.fileSize && asset.fileSize > 2 * 1024 * 1024) { // Giảm từ 5MB xuống 2MB
          Alert.alert("Lỗi", "Kích thước ảnh không được vượt quá 2MB");
          return;
        }
        
        setUploading(true);
        try {
          // Kiểm tra file tồn tại (chỉ Android)
          if (Platform.OS === "android") {
            const fileInfo = await FileSystem.getInfoAsync(asset.uri);
            if (!fileInfo.exists) {
              throw new Error("File không tồn tại hoặc không thể truy cập");
            }
          }
          
          // Upload với timeout
          const imgbbResponse = await Promise.race([
            uploadImageToImgBB(asset.uri),
            new Promise((_, reject) => 
              setTimeout(() => reject(new Error('Upload timeout')), 20000)
            )
          ]);
          
          onAvatarChange(imgbbResponse.url);
          setModalVisible(false);
        } catch (uploadError) {
          Alert.alert(
            "Lỗi",
            uploadError.message ||
              "Không thể tải ảnh lên. Vui lòng thử lại sau."
          );
        } finally {
          setUploading(false);
        }
      }
    } catch (error) {
      Alert.alert("Lỗi", "Không thể chụp ảnh");
    }
  };

  const selectPredefinedAvatar = (avatarUri) => {
    onAvatarChange(avatarUri);
    setModalVisible(false);
  };

  const removeAvatar = () => {
    onAvatarChange(null);
    setModalVisible(false);
  };

  return (
    <>
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        className="items-center"
        activeOpacity={0.7}
      >
        <View className="relative">
          <View
            className={`w-20 h-20 rounded-full border-4 ${
              isDarkMode ? "border-gray-600" : "border-white"
            } overflow-hidden`}
          >
            {currentAvatar ? (
              <Image
                source={{ uri: currentAvatar }}
                className="w-full h-full"
                resizeMode="cover"
              />
            ) : (
              <View
                className={`w-full h-full items-center justify-center ${
                  isDarkMode ? "bg-gray-700" : "bg-gray-200"
                }`}
              >
                <Icon
                  name="smile"
                  size={32}
                  color={isDarkMode ? "#9ca3af" : "#6b7280"}
                />
              </View>
            )}
          </View>
          <View className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-600 rounded-full items-center justify-center">
            <Icon name="camera" size={12} color="white" />
          </View>
        </View>
        <Text
          className={`text-xs mt-2 ${
            isDarkMode ? "text-gray-400" : "text-gray-600"
          }`}
        >
          Chạm để thay đổi
        </Text>
      </TouchableOpacity>
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
        statusBarTranslucent
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 9999,
          }}
        >
          <View
            style={{
              width: "90%",
              maxHeight: "80%",
              backgroundColor: isDarkMode ? "#374151" : "white",
              borderRadius: 12,
              padding: 24,
              elevation: 5,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
            }}
          >
            <View className="flex-row justify-between items-center mb-4">
              <Text
                className={`text-lg font-semibold ${
                  isDarkMode ? "text-white" : "text-gray-800"
                }`}
              >
                Chọn ảnh đại diện
              </Text>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                className="p-2"
              >
                <Icon
                  name="times"
                  size={20}
                  color={isDarkMode ? "#9ca3af" : "#6b7280"}
                />
              </TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
              {uploading && (
                <View className="items-center justify-center py-6">
                  <ActivityIndicator size="large" color="#3b82f6" />
                  <Text
                    className={`mt-2 ${
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Đang tải ảnh lên...
                  </Text>
                </View>
              )}
              {!uploading && (
                <>
                  <View className="flex-row justify-between mb-6">
                    <TouchableOpacity
                      onPress={takePhoto}
                      className={`flex-1 py-3 px-4 rounded-lg mr-2 border ${
                        isDarkMode
                          ? "bg-gray-700 border-gray-600"
                          : "bg-gray-50 border-gray-200"
                      }`}
                    >
                      <View className="items-center">
                        <Icon
                          name="camera"
                          size={24}
                          color={isDarkMode ? "#9ca3af" : "#6b7280"}
                        />
                        <Text
                          className={`text-xs mt-1 ${
                            isDarkMode ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          Chụp ảnh
                        </Text>
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={pickImageFromGallery}
                      className={`flex-1 py-3 px-4 rounded-lg ml-2 border ${
                        isDarkMode
                          ? "bg-gray-700 border-gray-600"
                          : "bg-gray-50 border-gray-200"
                      }`}
                    >
                      <View className="items-center">
                        <Icon
                          name="images"
                          size={24}
                          color={isDarkMode ? "#9ca3af" : "#6b7280"}
                        />
                        <Text
                          className={`text-xs mt-1 ${
                            isDarkMode ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          Thư viện
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                  <Text
                    className={`text-sm font-medium mb-3 ${
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Avatar có sẵn
                  </Text>
                  <View className="flex-row flex-wrap justify-between">
                    {predefinedAvatars.map((avatar) => (
                      <TouchableOpacity
                        key={avatar.id}
                        onPress={() => selectPredefinedAvatar(avatar.uri)}
                        className="w-16 h-16 rounded-full overflow-hidden mb-3 border-2 border-transparent"
                        style={{
                          borderColor:
                            currentAvatar === avatar.uri
                              ? "#3b82f6"
                              : "transparent",
                        }}
                      >
                        <Image
                          source={{ uri: avatar.uri }}
                          className="w-full h-full"
                          resizeMode="cover"
                        />
                      </TouchableOpacity>
                    ))}
                  </View>
                  {currentAvatar && (
                    <TouchableOpacity
                      onPress={removeAvatar}
                      className="py-3 mt-4 border border-red-300 rounded-lg"
                    >
                      <Text className="text-red-600 text-center font-medium">
                        Xóa ảnh đại diện
                      </Text>
                    </TouchableOpacity>
                  )}
                </>
              )}
            </ScrollView>
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              className="mt-4 py-3 bg-blue-600 rounded-lg"
            >
              <Text className="text-white text-center font-medium">Đóng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default AvatarPicker;
