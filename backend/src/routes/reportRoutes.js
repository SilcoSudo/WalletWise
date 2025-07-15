const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const authMiddleware = require('../middleware/authMiddleware');

// Tạo báo cáo
router.post('/', authMiddleware, reportController.createReport);
// Lấy tất cả báo cáo
router.get('/', authMiddleware, reportController.getReports);
// Lấy 1 báo cáo
router.get('/:id', authMiddleware, reportController.getReportById);
// Cập nhật tên hoặc thời gian báo cáo
router.put('/:id', authMiddleware, reportController.updateReport);
// Xoá báo cáo
router.delete('/:id', authMiddleware, reportController.deleteReport);

module.exports = router; 