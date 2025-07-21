//LeTrieuAn
const User = require('../models/User');  // Import model User để tương tác với collection users

// Lấy tất cả cài đặt của người dùng hiện tại
exports.getSettings = async (req, res) => {
  try {
    // Tìm user theo ID trong JWT (được gán vào req.user.id bởi middleware)
    // Chỉ select hai trường language và notifications
    const user = await User.findById(req.user.id).select('language notifications');
    if (!user) {
      // Nếu không tìm thấy user, trả về 404
      return res.status(404).json({ message: 'User not found' });
    }
    // Trả về JSON chứa cài đặt hiện tại
    res.json({
      language: user.language,
      notifications: user.notifications,
    });
  } catch (error) {
    // Xử lý lỗi server
    res.status(500).json({ message: 'Server error', error });
  }
};

// Cập nhật cài đặt ngôn ngữ
exports.updateLanguage = async (req, res) => {
  const { language } = req.body;  // Lấy giá trị language từ request body
  try {
    // Tìm user theo ID
    const user = await User.findById(req.user.id);
    if (!user) {
      // Nếu user không tồn tại, trả về 404
      return res.status(404).json({ message: 'User not found' });
    }
    user.language = language;      // Gán ngôn ngữ mới
    await user.save();             // Lưu thay đổi vào database
    // Trả về ngôn ngữ đã cập nhật
    res.json({ language: user.language });
  } catch (error) {
    // Xử lý lỗi server
    res.status(500).json({ message: 'Server error', error });
  }
};

// Cập nhật cài đặt thông báo
exports.updateNotifications = async (req, res) => {
  const { enabled } = req.body;  // Lấy giá trị enabled (true/false) từ request body
  try {
    // Tìm user theo ID
    const user = await User.findById(req.user.id);
    if (!user) {
      // Nếu user không tồn tại, trả về 404
      return res.status(404).json({ message: 'User not found' });
    }
    // Gán trạng thái thông báo mới vào thuộc tính notifications.enabled
    user.notifications.enabled = enabled;
    await user.save();             // Lưu thay đổi vào database
    // Trả về đối tượng notifications đã cập nhật
    res.json({ notifications: user.notifications });
  } catch (error) {
    // Xử lý lỗi server
    res.status(500).json({ message: 'Server error', error });
  }
};
