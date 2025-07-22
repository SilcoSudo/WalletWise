const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Get user profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Update user profile
exports.updateProfile = async (req, res) => {
  const { name, email, avatar, currentPassword } = req.body;
  try {
    const user = await User.findById(req.user.id);

    if (user) {
      // Nếu đổi email, yêu cầu nhập đúng mật khẩu hiện tại
      if (email && email !== user.email) {
        if (!currentPassword) {
          return res.status(400).json({ message: 'Vui lòng nhập mật khẩu hiện tại để đổi email' });
        }
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
          return res.status(400).json({ message: 'Mật khẩu hiện tại không đúng' });
        }
        const existing = await User.findOne({ email });
        if (existing && existing._id.toString() !== user._id.toString()) {
          return res.status(400).json({ message: 'Email đã tồn tại' });
        }
        user.email = email;
      }
      user.name = name || user.name;
      if (avatar !== undefined) user.avatar = avatar;
      const updatedUser = await user.save();
      res.json(updatedUser);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Change password
exports.changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Incorrect current password' });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete user account
exports.deleteAccount = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user.id);
    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete all user data (transactions, budgets, categories, reports)
exports.deleteAllUserData = async (req, res) => {
  try {
    const userId = req.user.id;
    const Transaction = require('../models/Transaction');
    const Budget = require('../models/Budget');
    const Category = require('../models/Category');
    const Report = require('../models/Report');

    // Xóa tất cả giao dịch
    await Transaction.deleteMany({ userId });
    // Xóa tất cả ngân sách
    await Budget.deleteMany({ userId });
    // Xóa tất cả danh mục (trừ mặc định nếu cần)
    await Category.deleteMany({ userId });
    // Xóa tất cả báo cáo
    await Report.deleteMany({ userId });

    res.json({ message: 'Đã xóa toàn bộ dữ liệu người dùng.' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi xóa dữ liệu', error: error.message });
  }
};
