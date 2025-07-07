const Category = require("../models/Category");

// Get all categories
const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    console.error("Get categories error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Create new category
const createCategory = async (req, res) => {
  try {
    const { name, type, icon, color, bgColor } = req.body;

    const category = new Category({
      name,
      type,
      icon: icon || "utensils",
      color,
      bgColor,
      editable: true,
      deletable: true,
    });

    await category.save();
    res.status(201).json(category);
  } catch (error) {
    console.error("Create category error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update category
const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, type, icon, color, bgColor } = req.body;

    // Kiểm tra category có tồn tại và có thể chỉnh sửa không
    const existingCategory = await Category.findById(id);
    if (!existingCategory) {
      return res.status(404).json({ message: "Category not found" });
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

// Delete category
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    // Kiểm tra category có tồn tại và có thể xóa không
    const existingCategory = await Category.findById(id);
    if (!existingCategory) {
      return res.status(404).json({ message: "Category not found" });
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
