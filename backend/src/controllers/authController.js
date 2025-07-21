const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const { sendVerificationEmail, sendResetPasswordEmail } = require('../utils/emailService');

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

// Register user
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email đã tồn tại' });
    }
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    // Create email verification token
    const emailVerificationToken = crypto.randomBytes(32).toString('hex');
    const emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000; // 24h
    // Create user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      isEmailVerified: false,
      emailVerificationToken,
      emailVerificationExpires,
      createdAt: new Date()
    });
    await user.save();
    // Send verification email
    const verifyLink = `http://${req.headers.host}/api/auth/verify-email?token=${emailVerificationToken}&email=${email}`;
    await sendVerificationEmail(email, verifyLink);
    // Generate token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );
    res.status(201).json({
      message: 'User created successfully. Please check your email to verify your account.',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        isEmailVerified: user.isEmailVerified
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Verify email
const verifyEmail = async (req, res) => {
  try {
    const { token, email } = req.query;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Không tìm thấy người dùng' });
    }
    // Nếu xác thực đổi mật khẩu
    if (user.pendingNewPasswordToken === token && user.pendingNewPasswordExpires > Date.now()) {
      user.password = user.pendingNewPassword;
      user.pendingNewPassword = undefined;
      user.pendingNewPasswordToken = undefined;
      user.pendingNewPasswordExpires = undefined;
      await user.save();
      // Nếu là request từ trình duyệt (không phải API), trả về HTML đẹp
      if (req.headers.accept && req.headers.accept.includes('text/html')) {
        return res.send(`
          <html>
            <head>
              <title>Đổi mật khẩu thành công</title>
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="font-family: sans-serif; text-align: center; margin-top: 50px;">
              <h2 style="color: #00796b;">Đổi mật khẩu thành công!</h2>
              <p>Bạn có thể quay lại ứng dụng và đăng nhập bằng mật khẩu mới.</p>
            </body>
          </html>
        `);
      }
      // Nếu là API (Accept: application/json)
      return res.json({ message: 'Đổi mật khẩu thành công. Bạn có thể đăng nhập bằng mật khẩu mới.' });
    }
    // Xác thực email như cũ
    if (user.emailVerificationToken === token && user.emailVerificationExpires > Date.now()) {
      user.isEmailVerified = true;
      user.emailVerificationToken = undefined;
      user.emailVerificationExpires = undefined;
      await user.save();
      return res.json({ message: 'Xác thực email thành công' });
    }
    return res.status(400).json({ message: 'Token không hợp lệ hoặc đã hết hạn' });
  } catch (error) {
    console.error('Verify email error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Forgot password
const forgotPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Email không tồn tại' });
    }
    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ message: 'Mật khẩu mới phải có ít nhất 6 ký tự' });
    }
    const pendingNewPasswordToken = crypto.randomBytes(32).toString('hex');
    user.pendingNewPassword = await bcrypt.hash(newPassword, 10);
    user.pendingNewPasswordToken = pendingNewPasswordToken;
    user.pendingNewPasswordExpires = Date.now() + 60 * 60 * 1000; // 1h
    await user.save();
    const verifyLink = `http://${req.headers.host}/api/auth/verify-email?token=${pendingNewPasswordToken}&email=${email}`;
    await sendVerificationEmail(email, verifyLink);
    res.json({ message: 'Đã gửi email xác thực. Vui lòng kiểm tra hộp thư.' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Reset password
const resetPassword = async (req, res) => {
  try {
    const { token, email, newPassword } = req.body;
    const user = await User.findOne({ email, resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } });
    if (!user) {
      return res.status(400).json({ message: 'Token không hợp lệ hoặc đã hết hạn' });
    }
    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    res.json({ message: 'Đặt lại mật khẩu thành công' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Login user (giữ nguyên)
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Email hoặc mật khẩu không đúng' });
    }
    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ message: 'Email hoặc mật khẩu không đúng' });
    }
    // Generate token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );
    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        isEmailVerified: user.isEmailVerified
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Guest login (giữ nguyên)
const guestLogin = async (req, res) => {
  try {
    // Create or find guest user
    let guestUser = await User.findOne({ email: 'guest@example.com' });
    if (!guestUser) {
      guestUser = new User({
        name: 'Guest User',
        email: 'guest@example.com',
        password: await bcrypt.hash('guest123', 10),
        createdAt: new Date()
      });
      await guestUser.save();
    }
    const token = jwt.sign(
      { userId: guestUser._id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );
    res.json({
      message: 'Guest login successful',
      token,
      user: {
        id: guestUser._id,
        name: guestUser.name,
        email: guestUser.email,
        avatar: guestUser.avatar,
        isEmailVerified: guestUser.isEmailVerified
      }
    });
  } catch (error) {
    console.error('Guest login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Xác thực token đặt lại mật khẩu qua GET
const verifyResetPasswordToken = async (req, res) => {
  try {
    const { token, email } = req.query;
    const user = await User.findOne({ email, resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } });
    if (!user) {
      return res.status(400).json({ message: 'Token không hợp lệ hoặc đã hết hạn' });
    }
    res.json({ message: 'Token hợp lệ. Bạn có thể đặt lại mật khẩu.' });
  } catch (error) {
    console.error('Verify reset password token error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Đổi mật khẩu trực tiếp qua email (không cần token, dùng cho quên mật khẩu gộp)
const resetPasswordDirect = async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Email không tồn tại' });
    }
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.json({ message: 'Đổi mật khẩu thành công' });
  } catch (error) {
    console.error('Reset password direct error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  register,
  login,
  guestLogin,
  verifyEmail,
  forgotPassword,
  resetPassword,
  verifyResetPasswordToken,
  resetPasswordDirect
};
