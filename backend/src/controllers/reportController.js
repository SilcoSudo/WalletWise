const Report = require('../models/Report');
const Transaction = require('../models/Transaction');
const Category = require('../models/Category');

// Tạo báo cáo mới
exports.createReport = async (req, res) => {
  try {
    const { title, startDate, endDate } = req.body;
    if (!title || !startDate || !endDate) {
      return res.status(400).json({ message: 'Vui lòng nhập đầy đủ thông tin báo cáo.' });
    }
    if (new Date(startDate) > new Date(endDate)) {
      return res.status(400).json({ message: 'Thời gian bắt đầu phải trước thời gian kết thúc.' });
    }
    // Lấy các transaction trong khoảng thời gian
    const transactions = await Transaction.find({
      userId: req.user._id,
      date: { $gte: new Date(startDate), $lte: new Date(endDate) }
    }).populate('categoryId');
    // Tổng hợp details
    const details = transactions.map(t => ({
      category: t.categoryId ? t.categoryId.name : 'Khác',
      amount: Math.abs(t.amount),
      type: t.type,
      note: t.note,
      date: t.date
    }));
    const report = await Report.create({ title, startDate, endDate, details, userId: req.user._id });
    res.status(201).json(report);
  } catch (err) {
    console.error('Lỗi tạo báo cáo:', err);
    res.status(500).json({ message: 'Lỗi tạo báo cáo', error: err.message });
  }
};

// Lấy tất cả báo cáo của user hiện tại
exports.getReports = async (req, res) => {
  try {
    const reports = await Report.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(reports);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi lấy danh sách báo cáo', error: err.message });
  }
};

// Lấy 1 báo cáo theo id
exports.getReportById = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) return res.status(404).json({ message: 'Không tìm thấy báo cáo.' });
    res.json(report);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi lấy báo cáo', error: err.message });
  }
};

// Cập nhật tên hoặc thời gian báo cáo
exports.updateReport = async (req, res) => {
  try {
    const { title, startDate, endDate } = req.body;
    if (!title && !startDate && !endDate) {
      return res.status(400).json({ message: 'Cần có ít nhất 1 trường để cập nhật.' });
    }
    const updateData = {};
    if (title) updateData.title = title;
    if (startDate) updateData.startDate = startDate;
    if (endDate) updateData.endDate = endDate;
    if (updateData.startDate && updateData.endDate && new Date(updateData.startDate) > new Date(updateData.endDate)) {
      return res.status(400).json({ message: 'Thời gian bắt đầu phải trước thời gian kết thúc.' });
    }
    const report = await Report.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!report) return res.status(404).json({ message: 'Không tìm thấy báo cáo.' });
    res.json(report);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi cập nhật báo cáo', error: err.message });
  }
};

// Xoá báo cáo
exports.deleteReport = async (req, res) => {
  try {
    const report = await Report.findByIdAndDelete(req.params.id);
    if (!report) return res.status(404).json({ message: 'Không tìm thấy báo cáo.' });
    res.json({ message: 'Đã xoá báo cáo thành công.' });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi xoá báo cáo', error: err.message });
  }
}; 