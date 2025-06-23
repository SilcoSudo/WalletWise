const Transaction = require('../models/Transaction');

// Get user statistics
const getStats = async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user._id });
    
    const totalIncome = transactions
      .filter(t => t.amount > 0)
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalExpense = transactions
      .filter(t => t.amount < 0)
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);
    
    const balance = totalIncome - totalExpense;
    
    // Category stats
    const categoryStats = {};
    transactions.forEach(t => {
      const category = t.categoryId ? t.categoryId.toString() : 'Khác';
      if (!categoryStats[category]) {
        categoryStats[category] = 0;
      }
      categoryStats[category] += Math.abs(t.amount);
    });
    
    res.json({
      balance,
      totalIncome,
      totalExpense,
      categoryStats
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getStats
};
