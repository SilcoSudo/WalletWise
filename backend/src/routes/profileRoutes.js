const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {
  getProfile,
  updateProfile,
  changePassword,
  deleteAccount,
} = require('../controllers/profileController');

// @route   GET api/profile
// @desc    Get user profile
// @access  Private
router.get('/', authMiddleware, getProfile);

// @route   PUT api/profile
// @desc    Update user profile
// @access  Private
router.put('/', authMiddleware, updateProfile);

// @route   PUT api/profile/change-password
// @desc    Change user password
// @access  Private
router.put('/change-password', authMiddleware, changePassword);

// @route   DELETE api/profile
// @desc    Delete user account
// @access  Private
router.delete('/', authMiddleware, deleteAccount);

module.exports = router;
