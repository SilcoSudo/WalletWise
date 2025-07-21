const Category = require("../models/Category");

// Get all categories of current user
const getAllCategories = async (req, res) => {
  try {
    const userId = req.user._id;
    const categories = await Category.find({ userId });
    res.json(categories);
  } catch (error) {
    console.error("Get categories error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Create new category for current user
const createCategory = async (req, res) => {
  try {
    const { name, type, icon, color, bgColor } = req.body;
    const userId = req.user._id;

    const category = new Category({
      name,
      type,
      icon: icon || "utensils",
      color,
      bgColor,
      editable: true,
      deletable: true,
      userId,
    });

    await category.save();
    res.status(201).json(category);
  } catch (error) {
    console.error("Create category error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update category for current user
const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
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

    await Category.findByIdAndDelete(id);
    res.json({ message: "Category deleted successfully" });
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
