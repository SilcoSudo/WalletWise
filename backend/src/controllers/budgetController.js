// backend/src/controllers/budgetController.js
const mongoose    = require('mongoose');
const Budget      = require('../models/Budget');
const Transaction = require('../models/Transaction');
const Category    = require('../models/Category');

/**
 * Enrich một budget với spent, percent, overLimit, expired
 */
async function enrichBudget(b) {
  // 1. Tính ngày hết hạn
  let expiry = new Date(b.createdAt);
  switch (b.period) {
    case 'Tuần':  expiry.setDate(expiry.getDate() + 7);  break;
    case 'Tháng': expiry.setMonth(expiry.getMonth() + 1);break;
    case 'Quý':   expiry.setMonth(expiry.getMonth() + 3);break;
    case 'Năm':   expiry.setFullYear(expiry.getFullYear() + 1);break;
  }
  const expired = Date.now() > expiry;

  // 2. Lookup transactions theo categoryId (id)
  let categoryId;
  try {
    categoryId = new mongoose.Types.ObjectId(b.category);
  } catch {
    categoryId = null;
  }
  let spent = 0;
  if (categoryId) {
    const agg = await Transaction.aggregate([
      { $match: { categoryId, type: 'expense' } },
      { $group: { _id: null, total: { $sum: { $abs: '$amount' } } } }
    ]);
    spent = agg[0]?.total || 0;
  }

  // 3. Tính %
  const percent   = b.limit > 0 ? Math.round(spent / b.limit * 100) : 0;
  const overLimit = spent > b.limit;

  return {
    id:        b._id,
    category:  b.category,
    limit:     b.limit,
    period:    b.period,
    alert:     b.alert,
    createdAt: b.createdAt,
    spent,
    percent,
    expired,
    overLimit
  };
}

exports.getBudgets = async (req, res) => {
  try {
    const status  = req.query.status || 'Active';
    const budgets = await Budget.find({ userId: req.user._id }).sort('-createdAt');
    const detailed = await Promise.all(budgets.map(enrichBudget));

    // Lọc theo status
    const filtered = detailed.filter(b => {
      if (status === 'All')     return true;
      if (status === 'Active')  return !b.expired;
      return b.expired;
    });

    res.json(filtered);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi lấy ngân sách' });
  }
};

exports.createBudget = async (req, res) => {
  try {
    const { category, limit, period, alert } = req.body;
    const b = await Budget.create({ userId: req.user._id, category, limit, period, alert });
    res.status(201).json({
      id:        b._id,
      category:  b.category,
      limit:     b.limit,
      period:    b.period,
      alert:     b.alert,
      spent:     0,
      percent:   0,
      expired:   false,
      overLimit: false
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Tạo ngân sách thất bại' });
  }
};

exports.updateBudget = async (req, res) => {
  try {
    const { id } = req.params;
    const upd = await Budget.findByIdAndUpdate(id, req.body, { new: true });
    if (!upd) return res.status(404).json({ message: 'Không tìm thấy ngân sách' });
    res.json({ message: 'Cập nhật thành công' });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Cập nhật thất bại' });
  }
};

exports.deleteBudget = async (req, res) => {
  try {
    const { id } = req.params;
    await Budget.findByIdAndDelete(id);
    res.json({ message: 'Xóa thành công' });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Xóa thất bại' });
  }
};

exports.getBudgetById = async (req, res) => {
  try {
    const { id } = req.params;
    const budget = await Budget.findOne({ _id: id, userId: req.user._id });
    if (!budget) {
      return res.status(404).json({ message: 'Budget not found' });
    }
    res.json(budget);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
