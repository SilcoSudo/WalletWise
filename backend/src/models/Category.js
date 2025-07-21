// Định nghĩa schema cho danh mục chi tiêu/thu nhập
// Mỗi danh mục thuộc về một user, có thể là chi tiêu hoặc thu nhập
const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: String, // Tên danh mục (ví dụ: Ăn uống, Lương)
  type: { type: String, enum: ["expense", "income"] }, // Loại: chi tiêu hoặc thu nhập
  icon: String, // Tên icon FontAwesome5 dùng cho giao diện
  color: String, // Màu icon
  bgColor: String, // Màu nền icon
  editable: { type: Boolean, default: true }, // Có thể chỉnh sửa không (danh mục hệ thống thì false)
  deletable: { type: Boolean, default: true }, // Có thể xóa không (danh mục hệ thống thì false)
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Liên kết user sở hữu danh mục
});

// Export model Category để sử dụng trong controller, routes
module.exports = mongoose.model("Category", categorySchema);
