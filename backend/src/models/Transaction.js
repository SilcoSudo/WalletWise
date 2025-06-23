const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  amount: Number,
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  type: { type: String, enum: ['expense', 'income'] },
  note: String,
  date: Date
});

module.exports = mongoose.model('Transaction', transactionSchema);
