const mongoose = require('mongoose');

const BudgetSchema = new mongoose.Schema({
  userId:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  category: { type: String, required: true },
  limit:    { type: Number, required: true },
  period:   { type: String, enum: ['Tuần','Tháng','Quý','Năm'], default: 'Tháng' },
  alert:    { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Budget', BudgetSchema);
