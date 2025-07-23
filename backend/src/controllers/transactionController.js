const Transaction = require('../models/Transaction');
const Category = require('../models/Category');

// Get all transactions for user
const getAllTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user._id })
      .populate('categoryId')
      .sort({ date: -1 });
    
    // Transform to match frontend format
    const transformedTransactions = transactions.map(t => ({
      id: t._id,
      type: t.type,
      category: t.categoryId ? t.categoryId.name : 'Khác',
      amount: Math.abs(t.amount),
      description: t.note,
      date: t.date,
      createdAt: t.date
    }));
    
    res.json(transformedTransactions);
  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create new transaction
const createTransaction = async (req, res) => {
  try {
    const { type, category, amount, description, date } = req.body;
    
    // Find category by name
    let categoryDoc = await Category.findOne({ name: category });
    if (!categoryDoc) {
      // Create category if not exists
      categoryDoc = new Category({
        name: category,
        type: type,
        icon: 'ellipsis-h',
        userId: req.user._id // Bổ sung userId
      });
      await categoryDoc.save();
    }
    
    const transaction = new Transaction({
      userId: req.user._id,
      amount: type === 'expense' ? -Math.abs(amount) : Math.abs(amount),
      categoryId: categoryDoc._id,
      type,
      note: description,
      date: date ? new Date(date) : new Date()
    });
    
    await transaction.save();
    
    // Return transformed transaction
    const savedTransaction = await Transaction.findById(transaction._id).populate('categoryId');
    res.status(201).json({
      id: savedTransaction._id,
      type: savedTransaction.type,
      category: savedTransaction.categoryId ? savedTransaction.categoryId.name : 'Khác',
      amount: Math.abs(savedTransaction.amount),
      description: savedTransaction.note,
      date: savedTransaction.date,
      createdAt: savedTransaction.date
    });
  } catch (error) {
    console.error('Add transaction error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update transaction
const updateTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const { type, category, amount, description, date } = req.body;
    
    // Find category by name
    let categoryDoc = await Category.findOne({ name: category });
    if (!categoryDoc) {
      categoryDoc = new Category({
        name: category,
        type: type,
        icon: 'ellipsis-h',
        userId: req.user._id // Bổ sung userId
      });
      await categoryDoc.save();
    }
    
    const transaction = await Transaction.findOneAndUpdate(
      { _id: id, userId: req.user._id },
      {
        amount: type === 'expense' ? -Math.abs(amount) : Math.abs(amount),
        categoryId: categoryDoc._id,
        type,
        note: description,
        date: date ? new Date(date) : new Date()
      },
      { new: true }
    ).populate('categoryId');
    
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    
    res.json({
      id: transaction._id,
      type: transaction.type,
      category: transaction.categoryId ? transaction.categoryId.name : 'Khác',
      amount: Math.abs(transaction.amount),
      description: transaction.note,
      date: transaction.date,
      createdAt: transaction.date
    });
  } catch (error) {
    console.error('Update transaction error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete transaction
const deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    
    const transaction = await Transaction.findOneAndDelete({ 
      _id: id, 
      userId: req.user._id 
    });
    
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    
    res.json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    console.error('Delete transaction error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getTransactionById = async (req, res) => {
  try {
    const { id } = req.params;
    const transaction = await Transaction.findOne({ _id: id, userId: req.user._id }).populate('categoryId');
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    res.json(transaction);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getAllTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getTransactionById,
};
