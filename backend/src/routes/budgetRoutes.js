//LeTrieuAn
const express = require('express');                         // Import Express framework
const router  = express.Router();                            // Tạo một instance router mới
const bc      = require('../controllers/budgetController'); // Import budgetController chứa logic CRUD
const { protect } = require('../middleware/authMiddleware'); // (Tuỳ chọn) Import middleware xác thực JWT

// Định nghĩa các route cho '/api/budgets'
router.route('/')
  .get(protect, bc.getBudgets)      // GET /api/budgets → chạy middleware protect để kiểm tra JWT, sau đó gọi getBudgets để lấy danh sách tất cả budgets
  .post(protect, bc.createBudget);  // POST /api/budgets → kiểm tra JWT rồi gọi createBudget để tạo budget mới

// Định nghĩa các route cho '/api/budgets/:id'
router.route('/:id')
  .put(protect, bc.updateBudget)    // PUT /api/budgets/:id → kiểm tra JWT rồi gọi updateBudget để cập nhật budget theo id
  .delete(protect, bc.deleteBudget);// DELETE /api/budgets/:id → kiểm tra JWT rồi gọi deleteBudget để xoá budget theo id

module.exports = router;                                     // Export router để sử dụng trong app chính (ví dụ: app.use('/api/budgets', router))
