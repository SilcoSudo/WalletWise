const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

// Kết nối MongoDB localhost với database WalletWise
mongoose.connect('mongodb://localhost:27017/WalletWise', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('Connected to MongoDB localhost (WalletWise)')).catch(err => console.error('Connection error:', err));

// Schema
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  createdAt: Date
});
const User = mongoose.model('User', userSchema);

const categorySchema = new mongoose.Schema({
  name: String,
  type: { type: String, enum: ['expense', 'income'] },
  icon: String
});
const Category = mongoose.model('Category', categorySchema);

const transactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  amount: Number,
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  type: { type: String, enum: ['expense', 'income'] },
  note: String,
  date: Date
});
const Transaction = mongoose.model('Transaction', transactionSchema);

// Dữ liệu mẫu
const seedData = async () => {
  try {
    // Xóa dữ liệu cũ
    await User.deleteMany({});
    await Category.deleteMany({});
    await Transaction.deleteMany({});

    // Tạo Users
    const users = [
      {
        name: 'Lê Triều An',
        email: 'user1@example.com',
        password: await bcrypt.hash('password123', 10),
        createdAt: new Date('2025-04-30')
      },
      {
        name: 'Trần Hoàng Quý',
        email: 'user2@example.com',
        password: await bcrypt.hash('password123', 10),
        createdAt: new Date('2025-04-30')
      }
    ];
    const savedUsers = await User.insertMany(users);

    // Tạo Categories
    const categories = [
      // Expense Categories
      { name: 'Ăn uống', type: 'expense', icon: 'utensils' },
      { name: 'Mua sắm', type: 'expense', icon: 'shopping-cart' },
      { name: 'Di chuyển', type: 'expense', icon: 'car' },
      { name: 'Hóa đơn', type: 'expense', icon: 'file-invoice' },
      { name: 'Giải trí', type: 'expense', icon: 'gamepad' },
      { name: 'Sức khỏe', type: 'expense', icon: 'heartbeat' },
      { name: 'Giáo dục', type: 'expense', icon: 'book' },
      { name: 'Nhà ở', type: 'expense', icon: 'home' },
      { name: 'Du lịch', type: 'expense', icon: 'plane' },
      { name: 'Khác (Chi)', type: 'expense', icon: 'ellipsis-h' },
      // Income Categories
      { name: 'Lương', type: 'income', icon: 'money-bill' },
      { name: 'Thưởng', type: 'income', icon: 'gift' },
      { name: 'Đầu tư', type: 'income', icon: 'chart-line' },
      { name: 'Quà tặng', type: 'income', icon: 'birthday-cake' },
      { name: 'Khác (Thu)', type: 'income', icon: 'ellipsis-h' }
    ];
    const savedCategories = await Category.insertMany(categories);

    // Tạo Transactions (2 tháng: 5/2025 và 6/2025)
    const transactions = [
      // User 1: Nguyễn Văn A (24 giao dịch)
      // Tháng 5/2025
      {
        userId: savedUsers[0]._id,
        amount: 120000,
        categoryId: savedCategories.find(c => c.name === 'Ăn uống')._id,
        type: 'expense',
        note: 'Ăn trưa cơm văn phòng',
        date: new Date('2025-05-02')
      },
      {
        userId: savedUsers[0]._id,
        amount: 80000,
        categoryId: savedCategories.find(c => c.name === 'Di chuyển')._id,
        type: 'expense',
        note: 'Grab đi làm',
        date: new Date('2025-05-03')
      },
      {
        userId: savedUsers[0]._id,
        amount: 10000000,
        categoryId: savedCategories.find(c => c.name === 'Lương')._id,
        type: 'income',
        note: 'Lương tháng 5',
        date: new Date('2025-05-05')
      },
      {
        userId: savedUsers[0]._id,
        amount: 300000,
        categoryId: savedCategories.find(c => c.name === 'Mua sắm')._id,
        type: 'expense',
        note: 'Mua giày thể thao',
        date: new Date('2025-05-07')
      },
      {
        userId: savedUsers[0]._id,
        amount: 150000,
        categoryId: savedCategories.find(c => c.name === 'Giải trí')._id,
        type: 'expense',
        note: 'Vé xem phim',
        date: new Date('2025-05-10')
      },
      {
        userId: savedUsers[0]._id,
        amount: 200000,
        categoryId: savedCategories.find(c => c.name === 'Hóa đơn')._id,
        type: 'expense',
        note: 'Tiền nước',
        date: new Date('2025-05-12')
      },
      {
        userId: savedUsers[0]._id,
        amount: 500000,
        categoryId: savedCategories.find(c => c.name === 'Sức khỏe')._id,
        type: 'expense',
        note: 'Khám răng',
        date: new Date('2025-05-15')
      },
      {
        userId: savedUsers[0]._id,
        amount: 250000,
        categoryId: savedCategories.find(c => c.name === 'Khác (Chi)')._id,
        type: 'expense',
        note: 'Quà sinh nhật bạn',
        date: new Date('2025-05-20')
      },
      {
        userId: savedUsers[0]._id,
        amount: 1000000,
        categoryId: savedCategories.find(c => c.name === 'Nhà ở')._id,
        type: 'expense',
        note: 'Tiền thuê phòng',
        date: new Date('2025-05-25')
      },
      {
        userId: savedUsers[0]._id,
        amount: 500000,
        categoryId: savedCategories.find(c => c.name === 'Đầu tư')._id,
        type: 'income',
        note: 'Lãi cổ phiếu',
        date: new Date('2025-05-28')
      },
      // Tháng 6/2025
      {
        userId: savedUsers[0]._id,
        amount: 150000,
        categoryId: savedCategories.find(c => c.name === 'Ăn uống')._id,
        type: 'expense',
        note: 'Ăn tối quán phở',
        date: new Date('2025-06-02')
      },
      {
        userId: savedUsers[0]._id,
        amount: 10000000,
        categoryId: savedCategories.find(c => c.name === 'Lương')._id,
        type: 'income',
        note: 'Lương tháng 6',
        date: new Date('2025-06-05')
      },
      {
        userId: savedUsers[0]._id,
        amount: 500000,
        categoryId: savedCategories.find(c => c.name === 'Mua sắm')._id,
        type: 'expense',
        note: 'Mua áo mới',
        date: new Date('2025-06-07')
      },
      {
        userId: savedUsers[0]._id,
        amount: 300000,
        categoryId: savedCategories.find(c => c.name === 'Giải trí')._id,
        type: 'expense',
        note: 'Xem phim CGV',
        date: new Date('2025-06-10')
      },
      {
        userId: savedUsers[0]._id,
        amount: 100000,
        categoryId: savedCategories.find(c => c.name === 'Di chuyển')._id,
        type: 'expense',
        note: 'Xăng xe máy',
        date: new Date('2025-06-12')
      },
      {
        userId: savedUsers[0]._id,
        amount: 200000,
        categoryId: savedCategories.find(c => c.name === 'Hóa đơn')._id,
        type: 'expense',
        note: 'Tiền điện',
        date: new Date('2025-06-15')
      },
      {
        userId: savedUsers[0]._id,
        amount: 300000,
        categoryId: savedCategories.find(c => c.name === 'Giáo dục')._id,
        type: 'expense',
        note: 'Khóa học online',
        date: new Date('2025-06-18')
      },
      {
        userId: savedUsers[0]._id,
        amount: 1000000,
        categoryId: savedCategories.find(c => c.name === 'Nhà ở')._id,
        type: 'expense',
        note: 'Tiền thuê phòng',
        date: new Date('2025-06-25')
      },
      {
        userId: savedUsers[0]._id,
        amount: 200000,
        categoryId: savedCategories.find(c => c.name === 'Quà tặng')._id,
        type: 'income',
        note: 'Tiền sinh nhật',
        date: new Date('2025-06-27')
      },
      {
        userId: savedUsers[0]._id,
        amount: 700000,
        categoryId: savedCategories.find(c => c.name === 'Du lịch')._id,
        type: 'expense',
        note: 'Vé máy bay Đà Nẵng',
        date: new Date('2025-06-28')
      },
      {
        userId: savedUsers[0]._id,
        amount: 150000,
        categoryId: savedCategories.find(c => c.name === 'Sức khỏe')._id,
        type: 'expense',
        note: 'Mua vitamin',
        date: new Date('2025-06-30')
      },

      // User 2: Trần Thị B (22 giao dịch)
      // Tháng 5/2025
      {
        userId: savedUsers[1]._id,
        amount: 100000,
        categoryId: savedCategories.find(c => c.name === 'Ăn uống')._id,
        type: 'expense',
        note: 'Cà phê sáng',
        date: new Date('2025-05-01')
      },
      {
        userId: savedUsers[1]._id,
        amount: 80000,
        categoryId: savedCategories.find(c => c.name === 'Di chuyển')._id,
        type: 'expense',
        note: 'Grab đi làm',
        date: new Date('2025-05-04')
      },
      {
        userId: savedUsers[1]._id,
        amount: 8000000,
        categoryId: savedCategories.find(c => c.name === 'Lương')._id,
        type: 'income',
        note: 'Lương tháng 5',
        date: new Date('2025-05-05')
      },
      {
        userId: savedUsers[1]._id,
        amount: 200000,
        categoryId: savedCategories.find(c => c.name === 'Mua sắm')._id,
        type: 'expense',
        note: 'Mua túi xách',
        date: new Date('2025-05-08')
      },
      {
        userId: savedUsers[1]._id,
        amount: 150000,
        categoryId: savedCategories.find(c => c.name === 'Hóa đơn')._id,
        type: 'expense',
        note: 'Tiền internet',
        date: new Date('2025-05-10')
      },
      {
        userId: savedUsers[1]._id,
        amount: 300000,
        categoryId: savedCategories.find(c => c.name === 'Giải trí')._id,
        type: 'expense',
        note: 'Vé concert',
        date: new Date('2025-05-12')
      },
      {
        userId: savedUsers[1]._id,
        amount: 120000,
        categoryId: savedCategories.find(c => c.name === 'Sức khỏe')._id,
        type: 'expense',
        note: 'Mua thuốc cảm',
        date: new Date('2025-05-15')
      },
      {
        userId: savedUsers[1]._id,
        amount: 2000000,
        categoryId: savedCategories.find(c => c.name === 'Thưởng')._id,
        type: 'income',
        note: 'Thưởng dự án',
        date: new Date('2025-05-20')
      },
      {
        userId: savedUsers[1]._id,
        amount: 800000,
        categoryId: savedCategories.find(c => c.name === 'Nhà ở')._id,
        type: 'expense',
        note: 'Tiền thuê trọ',
        date: new Date('2025-05-25')
      },
      {
        userId: savedUsers[1]._id,
        amount: 100000,
        categoryId: savedCategories.find(c => c.name === 'Khác (Chi)')._id,
        type: 'expense',
        note: 'Từ thiện',
        date: new Date('2025-05-28')
      },
      // Tháng 6/2025
      {
        userId: savedUsers[1]._id,
        amount: 130000,
        categoryId: savedCategories.find(c => c.name === 'Ăn uống')._id,
        type: 'expense',
        note: 'Ăn tối bún bò',
        date: new Date('2025-06-03')
      },
      {
        userId: savedUsers[1]._id,
        amount: 8000000,
        categoryId: savedCategories.find(c => c.name === 'Lương')._id,
        type: 'income',
        note: 'Lương tháng 6',
        date: new Date('2025-06-05')
      },
      {
        userId: savedUsers[1]._id,
        amount: 500000,
        categoryId: savedCategories.find(c => c.name === 'Du lịch')._id,
        type: 'expense',
        note: 'Vé tàu Đà Lạt',
        date: new Date('2025-06-07')
      },
      {
        userId: savedUsers[1]._id,
        amount: 200000,
        categoryId: savedCategories.find(c => c.name === 'Hóa đơn')._id,
        type: 'expense',
        note: 'Tiền điện',
        date: new Date('2025-06-10')
      },
      {
        userId: savedUsers[1]._id,
        amount: 100000,
        categoryId: savedCategories.find(c => c.name === 'Di chuyển')._id,
        type: 'expense',
        note: 'Grab đi siêu thị',
        date: new Date('2025-06-12')
      },
      {
        userId: savedUsers[1]._id,
        amount: 250000,
        categoryId: savedCategories.find(c => c.name === 'Mua sắm')._id,
        type: 'expense',
        note: 'Mua mỹ phẩm',
        date: new Date('2025-06-15')
      },
      {
        userId: savedUsers[1]._id,
        amount: 200000,
        categoryId: savedCategories.find(c => c.name === 'Giáo dục')._id,
        type: 'expense',
        note: 'Sách kỹ năng',
        date: new Date('2025-06-18')
      },
      {
        userId: savedUsers[1]._id,
        amount: 300000,
        categoryId: savedCategories.find(c => c.name === 'Sức khỏe')._id,
        type: 'expense',
        note: 'Gym tháng 6',
        date: new Date('2025-06-20')
      },
      {
        userId: savedUsers[1]._id,
        amount: 800000,
        categoryId: savedCategories.find(c => c.name === 'Nhà ở')._id,
        type: 'expense',
        note: 'Tiền thuê trọ',
        date: new Date('2025-06-25')
      },
      {
        userId: savedUsers[1]._id,
        amount: 500000,
        categoryId: savedCategories.find(c => c.name === 'Đầu tư')._id,
        type: 'income',
        note: 'Lãi tiết kiệm',
        date: new Date('2025-06-27')
      },
      {
        userId: savedUsers[1]._id,
        amount: 150000,
        categoryId: savedCategories.find(c => c.name === 'Giải trí')._id,
        type: 'expense',
        note: 'Vé xem phim',
        date: new Date('2025-06-30')
      }
    ];
    await Transaction.insertMany(transactions);

    console.log('Dữ liệu mẫu đã được insert thành công!');
    mongoose.connection.close();
  } catch (err) {
    console.error('Lỗi khi insert dữ liệu:', err);
    mongoose.connection.close();
  }
};

// Chạy script
seedData();