const Budget      = require('../models/Budget');
const Transaction = require('../models/Transaction');

/**
 * Tính tổng tiền đã chi cho 1 danh mục trong khoảng từ createdAt -> expiryDate
 */
async function calcSpent(budget) {
  const { category, createdAt, period } = budget;
  // xác định hạn: createdAt + period
  let expiry = new Date(createdAt);
  switch (period) {
    case 'Tuần':  expiry.setDate(expiry.getDate() + 7);  break;
    case 'Tháng': expiry.setMonth(expiry.getMonth() + 1);break;
    case 'Quý':   expiry.setMonth(expiry.getMonth() + 3);break;
    case 'Năm':   expiry.setFullYear(expiry.getFullYear() + 1);break;
  }
  // aggregate transactions
  const agg = await Transaction.aggregate([
    { $match: { category } },
    { $group: { _id: null, total: { $sum: '$amount' } } }
  ]);
  const spent = agg[0]?.total || 0;
  return { spent, expired: new Date() > expiry };
}

exports.getBudgets = async (req, res) => {
  try {
    const status = req.query.status || 'Active';
    const budgets = await Budget.find().sort('-createdAt');
    // Đưa vào spent + expired
    const withSpent = await Promise.all(
      budgets.map(async b => {
        const { spent, expired } = await calcSpent(b);
        return {
          id: b._id,
          category: b.category,
          limit: b.limit,
          period: b.period,
          alert: b.alert,
          spent,
          expired,
          createdAt: b.createdAt
        };
      })
    );
    // Lọc theo trạng thái
    const filtered = withSpent.filter(b => 
      status==='All'     ? true 
    : status==='Active'  ? !b.expired 
                        :  b.expired
    );
    res.json(filtered);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi lấy ngân sách' });
  }
};

exports.createBudget = async (req, res) => {
  try {
    const { category, limit, period, alert } = req.body;
    const b = await Budget.create({ category, limit, period, alert });
    res.status(201).json({ id: b._id, category, limit, period, alert, spent: 0, expired: false });
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
