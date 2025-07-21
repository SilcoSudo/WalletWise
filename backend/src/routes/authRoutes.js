const express = require('express');
const { register, login, guestLogin, verifyEmail, forgotPassword, resetPassword, verifyResetPasswordToken, resetPasswordDirect } = require('../controllers/authController');

const router = express.Router();

// Auth routes
router.post('/register', register);
router.post('/login', login);
router.post('/guest', guestLogin);
router.post('/verify-email', verifyEmail);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/reset-password-direct', resetPasswordDirect);
router.get('/verify-email', verifyEmail);
router.get('/reset-password', verifyResetPasswordToken);

module.exports = router;
