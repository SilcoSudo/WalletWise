const express = require('express');
const router  = express.Router();
const bc      = require('../controllers/budgetController');
const { protect } = require('../middleware/authMiddleware'); // nếu có auth


router.route('/')
  .get(bc.getBudgets)
  .post(bc.createBudget);

router.route('/:id')
  .put(bc.updateBudget)
  .delete(bc.deleteBudget);

module.exports = router;
