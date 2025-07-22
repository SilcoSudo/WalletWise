// API Configuration
// Update this URL based on your environment:
// - For Android emulator: 'http://10.0.2.2:5000/api'
// - For iOS simulator: 'http://localhost:5000/api'
// - For physical device: 'http://YOUR_COMPUTER_IP:5000/api'
// - For web: 'http://localhost:5000/api'

const API_BASE_URL = "http://192.168.242.129:5000/api";

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

  verifyEmail: (data) =>
    apiRequest("/auth/verify-email", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  forgotPassword: (data) =>
    apiRequest("/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  resetPassword: (data) =>
    apiRequest("/auth/reset-password", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  resetPasswordDirect: async ({ email, newPassword }) => {
    const response = await fetch(`${API_BASE_URL}/auth/reset-password-direct`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, newPassword }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "API request failed");
    }
    return data;
  },

  logout: () =>
    apiRequest("/auth/logout", {
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

// Xóa toàn bộ dữ liệu user (KHÔNG xóa tài khoản)
export const deleteAllUserData = () => apiRequest("/profile/data", { method: "DELETE" });

// ==== API Báo cáo (Report) ====
// Lấy danh sách báo cáo
export const getReports = () => apiRequest("/reports");
// Tạo báo cáo mới
export const createReport = (data) => apiRequest("/reports", {
  method: "POST",
  body: JSON.stringify(data),
});
// Sửa báo cáo
export const updateReport = (id, data) => apiRequest(`/reports/${id}`, {
  method: "PUT",
  body: JSON.stringify(data),
});
// Xóa báo cáo
export const deleteReport = (id) => apiRequest(`/reports/${id}`, {
  method: "DELETE",
});
// Export báo cáo ra CSV
export const exportReport = (id) => apiRequest(`/reports/export/${id}`, {
  responseType: "blob",
});
// Import báo cáo từ CSV (dữ liệu đã parse thành object)
export const importReport = (data) => apiRequest("/reports/import", {
  method: "POST",
  body: JSON.stringify(data),
});
// Tải dữ liệu mẫu (chạy lại seedData.js)
export const seedDataReport = () => apiRequest("/reports/seed", {
  method: "POST",
});

export const budgetsAPI = {
  getAll: () => apiRequest("/budgets"),
  create: (data) =>
    apiRequest("/budgets", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (id, data) =>
    apiRequest(`/budgets/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  delete: (id) =>
    apiRequest(`/budgets/${id}`, {
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
  budgets: budgetsAPI,
};
