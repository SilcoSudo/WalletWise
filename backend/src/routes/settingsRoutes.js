//LeTrieuAn
const express = require('express');                        // Import Express framework
const router  = express.Router();                           // Tạo instance của router để định nghĩa các route
const authMiddleware = require('../middleware/authMiddleware'); // Import middleware xác thực JWT

const {
  getSettings,             // Controller lấy về cài đặt người dùng
  updateLanguage,          // Controller cập nhật ngôn ngữ
  updateNotifications,     // Controller cập nhật cài đặt thông báo
} = require('../controllers/settingsController');

// @route   GET api/settings
// @desc    Lấy tất cả cài đặt của user
// @access  Private (cần JWT)
router.get(
  '/', 
  authMiddleware,           // Chặn truy cập nếu không có token hợp lệ
  getSettings               // Gọi controller để trả về settings
);

// @route   PUT api/settings/language
// @desc    Cập nhật ngôn ngữ của user
// @access  Private (cần JWT)
router.put(
  '/language', 
  authMiddleware,           // Xác thực JWT
  updateLanguage            // Gọi controller để lưu ngôn ngữ mới
);

// @route   PUT api/settings/notifications
// @desc    Cập nhật cài đặt thông báo (push, email…)
// @access  Private (cần JWT)
router.put(
  '/notifications', 
  authMiddleware,           // Xác thực JWT
  updateNotifications       // Gọi controller để lưu cài đặt thông báo mới
);

module.exports = router;                                    // Export router để dùng trong app chính
