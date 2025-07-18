// API Configuration
// Update this URL based on your environment:
// - For Android emulator: 'http://10.0.2.2:5000/api'
// - For iOS simulator: 'http://localhost:5000/api'
// - For physical device: 'http://YOUR_COMPUTER_IP:5000/api'
// - For web: 'http://localhost:5000/api'

const API_BASE_URL = "http://192.168.114.129:5000/api";

// Helper function to get auth token
const getAuthToken = () => {
  // In a real app, you'd get this from secure storage
  return global.authToken;
};

// Helper function to set auth token
export const setAuthToken = (token) => {
  global.authToken = token;
};

// Helper function to make API requests
const apiRequest = async (endpoint, options = {}) => {
  const token = getAuthToken();

  const config = {
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    console.log(`Making API request to: ${API_BASE_URL}${endpoint}`);
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    // Log response status
    console.log(`API response status: ${response.status}`);

    const data = await response.json();
    console.log(`API response data:`, data);

    if (!response.ok) {
      throw new Error(data.message || "API request failed");
    }

    return data;
  } catch (error) {
    console.error("API Error:", error);
    // If it's a network error, provide a more helpful message
    if (error.message.includes("Network request failed")) {
      throw new Error(
        "Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng và đảm bảo máy chủ đang chạy."
      );
    }
    throw error;
  }
};

// Auth API
export const authAPI = {
  register: (userData) =>
    apiRequest("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    }),

  login: (credentials) =>
    apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    }),

  guestLogin: () =>
    apiRequest("/auth/guest", {
      method: "POST",
    }),
};

// Transactions API
export const transactionsAPI = {
  getAll: () => apiRequest("/transactions"),

  create: (transactionData) =>
    apiRequest("/transactions", {
      method: "POST",
      body: JSON.stringify(transactionData),
    }),

  update: (id, transactionData) =>
    apiRequest(`/transactions/${id}`, {
      method: "PUT",
      body: JSON.stringify(transactionData),
    }),

  delete: (id) =>
    apiRequest(`/transactions/${id}`, {
      method: "DELETE",
    }),
};

// Stats API
export const statsAPI = {
  getStats: () => apiRequest("/stats"),
};

// Categories API
export const categoriesAPI = {
  getAll: () => apiRequest("/categories"),

  create: (categoryData) =>
    apiRequest("/categories", {
      method: "POST",
      body: JSON.stringify(categoryData),
    }),

  update: (id, categoryData) =>
    apiRequest(`/categories/${id}`, {
      method: "PUT",
      body: JSON.stringify(categoryData),
    }),

  delete: (id) =>
    apiRequest(`/categories/${id}`, {
      method: "DELETE",
    }),
};

// Settings API
export const settingsAPI = {
  getSettings: () => apiRequest("/settings"),

  updateLanguage: (language) =>
    apiRequest("/settings/language", {
      method: "PUT",
      body: JSON.stringify({ language }),
    }),

  updateNotifications: (enabled) =>
    apiRequest("/settings/notifications", {
      method: "PUT",
      body: JSON.stringify({ enabled }),
    }),
};

// Profile API
export const profileAPI = {
  getProfile: () => apiRequest("/profile"),

  updateProfile: (profileData) =>
    apiRequest("/profile", {
      method: "PUT",
      body: JSON.stringify(profileData),
    }),

  changePassword: (passwordData) =>
    apiRequest("/profile/change-password", {
      method: "PUT",
      body: JSON.stringify(passwordData),
    }),

  deleteAccount: () =>
    apiRequest("/profile", {
      method: "DELETE",
    }),
};

export default {
  auth: authAPI,
  transactions: transactionsAPI,
  stats: statsAPI,
  categories: categoriesAPI,
  settings: settingsAPI,
  profile: profileAPI,
};
