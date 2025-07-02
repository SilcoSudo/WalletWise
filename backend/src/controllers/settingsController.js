const User = require('../models/User');

// Get all settings
exports.getSettings = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('language notifications');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({
      language: user.language,
      notifications: user.notifications,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Update language settings
exports.updateLanguage = async (req, res) => {
  const { language } = req.body;
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    user.language = language;
    await user.save();
    res.json({ language: user.language });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Update notification settings
exports.updateNotifications = async (req, res) => {
  const { enabled } = req.body;
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    user.notifications.enabled = enabled;
    await user.save();
    res.json({ notifications: user.notifications });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
