const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: String,
  type: { type: String, enum: ['expense', 'income'] },
  icon: String
});

module.exports = mongoose.model('Category', categorySchema);
