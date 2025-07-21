//LeTrieuAn
const Budget      = require('../models/Budget');        // Import model Budget để thao tác với collection budgets
const Transaction = require('../models/Transaction');   // Import model Transaction để thao tác với collection transactions

/**
 * Tính tổng tiền đã chi cho một danh mục trong khoảng từ createdAt → expiryDate
 */
async function calcSpent(budget) {
  const { category, createdAt, period } = budget;
  // Xác định ngày hết hạn = createdAt + period tương ứng
  let expiry = new Date(createdAt);
  switch (period) {
    case 'Tuần':
      expiry.setDate(expiry.getDate() + 7);    // Thêm 7 ngày
      break;
    case 'Tháng':
      expiry.setMonth(expiry.getMonth() + 1);  // Thêm 1 tháng
      break;
    case 'Quý':
      expiry.setMonth(expiry.getMonth() + 3);  // Thêm 3 tháng
      break;
    case 'Năm':
      expiry.setFullYear(expiry.getFullYear() + 1); // Thêm 1 năm
      break;
  }
  // Aggregate: tính tổng amount trong transactions có cùng category
  const agg = await Transaction.aggregate([
    { $match: { category } },                         // Chọn transaction theo category
    { $group: { _id: null, total: { $sum: '$amount' } } } // Nhóm và tính tổng trường amount
  ]);
  const spent = agg[0]?.total || 0;                   // Lấy tổng, nếu không có kết quả thì 0
  return {
    spent,
    expired: new Date() > expiry                     // Kiểm tra đã quá hạn chưa
  };
}

// Lấy danh sách ngân sách kèm thông tin đã chi và trạng thái hết hạn
exports.getBudgets = async (req, res) => {
  try {
    const status = req.query.status || 'Active';     // Lấy filter từ query, mặc định Active
    const budgets = await Budget.find().sort('-createdAt'); // Lấy tất cả budgets, sắp xếp giảm dần theo createdAt

    // Tính spent và expired cho từng budget
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

    // Lọc theo trạng thái All / Active / Expired
    const filtered = withSpent.filter(b =>
      status === 'All'     ? true
    : status === 'Active'  ? !b.expired
                          :  b.expired
    );

    res.json(filtered);                              // Trả về mảng budgets đã filter
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi lấy ngân sách' }); // Xử lý lỗi server
  }
};

// Tạo mới một budget
exports.createBudget = async (req, res) => {
  try {
    const { category, limit, period, alert } = req.body;
    const b = await Budget.create({ category, limit, period, alert }); // Tạo document budget mới
    // Trả về budget vừa tạo với spent = 0, expired = false
    res.status(201).json({ id: b._id, category, limit, period, alert, spent: 0, expired: false });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Tạo ngân sách thất bại' });      // Xử lý lỗi đầu vào
  }
};

// Cập nhật một budget theo id
exports.updateBudget = async (req, res) => {
  try {
    const { id } = req.params;
    const upd = await Budget.findByIdAndUpdate(id, req.body, { new: true }); // Cập nhật và trả về document mới
    if (!upd) return res.status(404).json({ message: 'Không tìm thấy ngân sách' });
    res.json({ message: 'Cập nhật thành công' });                       // Thông báo thành công
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Cập nhật thất bại' });             // Xử lý lỗi cập nhật
  }
};

// Xóa một budget theo id
exports.deleteBudget = async (req, res) => {
  try {
    const { id } = req.params;
    await Budget.findByIdAndDelete(id);                                  // Xóa document budget
    res.json({ message: 'Xóa thành công' });                             // Thông báo thành công
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Xóa thất bại' });                   // Xử lý lỗi xóa
  }
};
