const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {
  getSettings,
  updateLanguage,
  updateNotifications,
} = require('../controllers/settingsController');

// @route   GET api/settings
// @desc    Get all settings
// @access  Private
router.get('/', authMiddleware, getSettings);

// @route   PUT api/settings/language
// @desc    Update language settings
// @access  Private
router.put('/language', authMiddleware, updateLanguage);

// @route   PUT api/settings/notifications
// @desc    Update notification settings
// @access  Private
router.put('/notifications', authMiddleware, updateNotifications);

module.exports = router;
