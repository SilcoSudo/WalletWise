const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  username: String,
  email: { type: String, unique: true },
  password: String,
  language: { type: String, default: 'vi' },
  notifications: {
    enabled: { type: Boolean, default: true },
    pushNotifications: { type: Boolean, default: true },
    emailNotifications: { type: Boolean, default: true },
    transactionAlerts: { type: Boolean, default: true },
    budgetAlerts: { type: Boolean, default: true }
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
