const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./src/models/User");
const Category = require("./src/models/Category");
const Transaction = require("./src/models/Transaction");
const Report = require("./src/models/Report");

async function seed() {
  await mongoose.connect("mongodb://localhost:27017/WalletWise");

  // Xóa dữ liệu cũ
  await User.deleteMany({});
  await Category.deleteMany({});
  await Transaction.deleteMany({});
  await Report.deleteMany({});

  // Hash password '123456'
  const hashedPassword = await bcrypt.hash("123456", 10);
  // Tạo user mẫu
  const user = await User.create({
    name: "Trần Hoàng Quýyyy",
    email: "sirogame002@gmail.com",
    password: hashedPassword,
    avatar: "https://i.ibb.co/your-avatar-link.png",
    language: "vi",
    notifications: {
      enabled: false,
      pushNotifications: false,
      emailNotifications: false,
      transactionAlerts: false,
      budgetAlerts: false
    }
  });

  // Tạo danh mục mẫu
  // Danh sách category mặc định giống khi đăng ký user mới
  const defaultCategories = [
    // Expense
    { name: "Ăn uống", type: "expense", icon: "utensils", color: "#dc2626", bgColor: "#fee2e2", editable: false, deletable: false },
    { name: "Mua sắm", type: "expense", icon: "shopping-cart", color: "#ca8a04", bgColor: "#fef9c3", editable: false, deletable: false },
    { name: "Di chuyển", type: "expense", icon: "car", color: "#0284c7", bgColor: "#bae6fd", editable: false, deletable: false },
    { name: "Hóa đơn", type: "expense", icon: "file-invoice", color: "#7c3aed", bgColor: "#ddd6fe", editable: false, deletable: false },
    { name: "Giải trí", type: "expense", icon: "gamepad", color: "#db2777", bgColor: "#fce7f3", editable: false, deletable: false },
    { name: "Sức khỏe", type: "expense", icon: "heartbeat", color: "#059669", bgColor: "#bbf7d0", editable: false, deletable: false },
    { name: "Giáo dục", type: "expense", icon: "book", color: "#d97706", bgColor: "#fde68a", editable: false, deletable: false },
    { name: "Nhà ở", type: "expense", icon: "home", color: "#9333ea", bgColor: "#f3e8ff", editable: false, deletable: false },
    { name: "Du lịch", type: "expense", icon: "plane", color: "#0284c7", bgColor: "#bae6fd", editable: false, deletable: false },
    { name: "Khác (Chi)", type: "expense", icon: "ellipsis-h", color: "#6b7280", bgColor: "#e5e7eb", editable: false, deletable: false },
    // Income
    { name: "Lương", type: "income", icon: "money-bill", color: "#059669", bgColor: "#d1fae5", editable: false, deletable: false },
    { name: "Thưởng", type: "income", icon: "gift", color: "#ca8a04", bgColor: "#fef9c3", editable: false, deletable: false },
    { name: "Đầu tư", type: "income", icon: "chart-line", color: "#0284c7", bgColor: "#bae6fd", editable: false, deletable: false },
    { name: "Quà tặng", type: "income", icon: "birthday-cake", color: "#db2777", bgColor: "#fce7f3", editable: false, deletable: false },
    { name: "Khác (Thu)", type: "income", icon: "ellipsis-h", color: "#6b7280", bgColor: "#e5e7eb", editable: false, deletable: false },
  ];
  const categories = await Category.insertMany(defaultCategories.map(cat => ({ ...cat, userId: user._id })));

  // Tạo giao dịch mẫu cho từng ngày đủ 2 tháng gần nhất
  const now = new Date();
  const transactions = [];
  const expenseCategories = categories.filter(c => c.type === "expense");
  const incomeCategories = categories.filter(c => c.type === "income");

  // Tháng này
  for (let i = 0; i < 30; i++) {
    // Chi tiêu
    transactions.push({
      userId: user._id,
      amount: Math.floor(Math.random() * 300 + 50),
      categoryId: expenseCategories[i % expenseCategories.length]._id,
      type: "expense",
      note: `Chi ${expenseCategories[i % expenseCategories.length].name}`,
      date: new Date(now.getFullYear(), now.getMonth(), i + 1)
    });
    // Thu nhập
    transactions.push({
      userId: user._id,
      amount: Math.floor(Math.random() * 500 + 200),
      categoryId: incomeCategories[i % incomeCategories.length]._id,
      type: "income",
      note: `Thu ${incomeCategories[i % incomeCategories.length].name}`,
      date: new Date(now.getFullYear(), now.getMonth(), i + 1)
    });
  }
  // Tháng trước
  for (let i = 0; i < 30; i++) {
    // Chi tiêu
    transactions.push({
      userId: user._id,
      amount: Math.floor(Math.random() * 300 + 50),
      categoryId: expenseCategories[i % expenseCategories.length]._id,
      type: "expense",
      note: `Chi ${expenseCategories[i % expenseCategories.length].name}`,
      date: new Date(now.getFullYear(), now.getMonth() - 1, i + 1)
    });
    // Thu nhập
    transactions.push({
      userId: user._id,
      amount: Math.floor(Math.random() * 500 + 200),
      categoryId: incomeCategories[i % incomeCategories.length]._id,
      type: "income",
      note: `Thu ${incomeCategories[i % incomeCategories.length].name}`,
      date: new Date(now.getFullYear(), now.getMonth() - 1, i + 1)
    });
  }
  await Transaction.insertMany(transactions);

  // Tạo report mẫu cho từng tháng
  await Report.create({
    title: "Báo cáo tháng này",
    startDate: new Date(now.getFullYear(), now.getMonth(), 1),
    endDate: new Date(now.getFullYear(), now.getMonth() + 1, 0),
    details: transactions
      .filter(tx => tx.date.getMonth() === now.getMonth())
      .map(tx => ({
        category: tx.categoryId.toString(),
        amount: tx.amount,
        type: tx.type,
        note: tx.note,
        date: tx.date
      })),
    userId: user._id,
    createdAt: new Date()
  });

  await Report.create({
    title: "Báo cáo tháng trước",
    startDate: new Date(now.getFullYear(), now.getMonth() - 1, 1),
    endDate: new Date(now.getFullYear(), now.getMonth(), 0),
    details: transactions
      .filter(tx => tx.date.getMonth() === now.getMonth() - 1)
      .map(tx => ({
        category: tx.categoryId.toString(),
        amount: tx.amount,
        type: tx.type,
        note: tx.note,
        date: tx.date
      })),
    userId: user._id,
    createdAt: new Date()
  });

  console.log("Seed dữ liệu mẫu thành công!");
  process.exit();
}

seed();