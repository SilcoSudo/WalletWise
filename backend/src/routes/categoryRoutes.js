// Khởi tạo router Express cho các API liên quan đến danh mục chi tiêu/thu nhập
const express = require("express");
// Import các hàm xử lý logic cho danh mục từ controller
const {
  getAllCategories, // Lấy tất cả danh mục của user hiện tại
  createCategory, // Tạo mới một danh mục
  updateCategory, // Cập nhật thông tin danh mục
  deleteCategory, // Xóa một danh mục
} = require("../controllers/categoryController");
// Middleware xác thực người dùng (bắt buộc phải đăng nhập mới thao tác được)
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router(); // Tạo instance router

// Định nghĩa các route API cho danh mục, tất cả đều yêu cầu xác thực

// GET /api/categories - Lấy tất cả danh mục của user
// Trả về mảng các danh mục (expense/income) thuộc về user hiện tại
router.get("/", authMiddleware, getAllCategories);

// POST /api/categories - Tạo mới một danh mục
// Nhận dữ liệu (name, type, icon, color, bgColor) từ body, tạo mới cho user
router.post("/", authMiddleware, createCategory);

// PUT /api/categories/:id - Cập nhật thông tin danh mục
// Chỉ cho phép sửa danh mục của user hiện tại, truyền id qua params
router.put("/:id", authMiddleware, updateCategory);

// DELETE /api/categories/:id - Xóa một danh mục
// Chỉ cho phép xóa danh mục của user hiện tại, truyền id qua params
router.delete("/:id", authMiddleware, deleteCategory);

// Export router để sử dụng trong server.js
module.exports = router;
