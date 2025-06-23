const express = require('express');
const { getAllCategories, createCategory } = require('../controllers/categoryController');

const router = express.Router();

// Category routes (public - no auth required)
router.get('/', getAllCategories);
router.post('/', createCategory);

module.exports = router;
