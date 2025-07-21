const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: String,
  type: { type: String, enum: ["expense", "income"] },
  icon: String,
  color: String,
  bgColor: String,
  editable: { type: Boolean, default: true },
  deletable: { type: Boolean, default: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

module.exports = mongoose.model("Category", categorySchema);
