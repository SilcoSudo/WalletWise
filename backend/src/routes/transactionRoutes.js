const express = require('express');
const { 
  getAllTransactions, 
  createTransaction, 
  updateTransaction, 
  deleteTransaction,
  getTransactionById
} = require('../controllers/transactionController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Transaction routes
router.get('/', getAllTransactions);
router.post('/', createTransaction);
router.put('/:id', updateTransaction);
router.delete('/:id', deleteTransaction);
router.get('/:id', authMiddleware, getTransactionById);

module.exports = router;
