const express = require('express');
const { getStats } = require('../controllers/statsController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Stats routes
router.get('/', getStats);

module.exports = router;
