const Category = require("../models/Category");
const Transaction = require("../models/Transaction");
const Budget = require("../models/Budget");

// Controller xử lý các API liên quan đến danh mục chi tiêu/thu nhập

// Lấy tất cả danh mục của user hiện tại
// Trả về mảng các danh mục (expense/income) thuộc về user
const getAllCategories = async (req, res) => {
  try {
    const userId = req.user._id; // Lấy id user từ token
    const categories = await Category.find({ userId }); // Tìm tất cả danh mục của user
    res.json(categories); // Trả về cho client
  } catch (error) {
    console.error("Get categories error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Tạo mới một danh mục cho user hiện tại
// Nhận dữ liệu từ body, lưu vào DB
const createCategory = async (req, res) => {
  try {
    const { name, type, icon, color, bgColor } = req.body;
    const userId = req.user._id;

    // Tạo instance mới cho danh mục
    const category = new Category({
      name,
      type,
      icon: icon || "utensils", // Nếu không truyền icon thì mặc định
      color,
      bgColor,
      editable: true, // Danh mục do user tạo luôn có thể sửa/xóa
      deletable: true,
      userId,
    });

    await category.save(); // Lưu vào DB
    res.status(201).json(category); // Trả về cho client
  } catch (error) {
    console.error("Create category error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Cập nhật thông tin danh mục cho user hiện tại
// Chỉ cho phép sửa danh mục của chính user đó
const updateCategory = async (req, res) => {
  try {
    const { id } = req.params; // Lấy id danh mục từ params
    const { name, type, icon, color, bgColor } = req.body;
    const userId = req.user._id;

    // Chỉ cho phép chỉnh sửa category của user hiện tại
    const existingCategory = await Category.findOne({ _id: id, userId });
    if (!existingCategory) {
      return res
        .status(404)
        .json({ message: "Category not found or not yours" });
    }

    if (existingCategory.editable === false) {
      return res.status(403).json({ message: "Category is not editable" });
    }

    const category = await Category.findByIdAndUpdate(
      id,
      { name, type, icon, color, bgColor },
      { new: true }
    );

    res.json(category);
  } catch (error) {
    console.error("Update category error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete category for current user
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    // Chỉ cho phép xóa category của user hiện tại
    const existingCategory = await Category.findOne({ _id: id, userId });
    if (!existingCategory) {
      return res
        .status(404)
        .json({ message: "Category not found or not yours" });
    }

    if (existingCategory.deletable === false) {
      return res.status(403).json({ message: "Category cannot be deleted" });
    }

    // Xóa transaction liên quan
    const txResult = await Transaction.deleteMany({ userId, categoryId: id });
    // Xóa budget liên quan
    const budgetResult = await Budget.deleteMany({ category: id });

    await Category.findByIdAndDelete(id);
    res.json({
      message: "Category deleted successfully",
      deletedTransactions: txResult.deletedCount,
      deletedBudgets: budgetResult.deletedCount
    });
  } catch (error) {
    console.error("Delete category error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};
