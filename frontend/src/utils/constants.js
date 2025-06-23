export const categories = [
  { id: 'food', name: 'Ăn uống', icon: 'utensils', color: 'bg-red-100', iconColor: 'text-red-500' },
  { id: 'housing', name: 'Nhà ở', icon: 'home', color: 'bg-purple-100', iconColor: 'text-purple-500' },
  { id: 'transport', name: 'Di chuyển', icon: 'car', color: 'bg-blue-100', iconColor: 'text-blue-500' },
  { id: 'entertainment', name: 'Giải trí', icon: 'gamepad', color: 'bg-green-100', iconColor: 'text-green-500' },
  { id: 'shopping', name: 'Mua sắm', icon: 'shopping-bag', color: 'bg-orange-100', iconColor: 'text-orange-500' },
  { id: 'health', name: 'Y tế', icon: 'heartbeat', color: 'bg-pink-100', iconColor: 'text-pink-500' },
  { id: 'education', name: 'Giáo dục', icon: 'graduation-cap', color: 'bg-indigo-100', iconColor: 'text-indigo-500' },
  { id: 'utilities', name: 'Điện nước', icon: 'bolt', color: 'bg-yellow-100', iconColor: 'text-yellow-500' },
];

export const mockTransactions = [
  {
    id: 1,
    title: 'Nhà hàng Phương Nam',
    amount: -350000,
    category: 'food',
    date: '19/06/2025',
    type: 'expense'
  },
  {
    id: 2,
    title: 'Siêu thị Vinmart',
    amount: -420000,
    category: 'shopping',
    date: '18/06/2025',
    type: 'expense'
  },
  {
    id: 3,
    title: 'Lương tháng 6',
    amount: 12000000,
    category: 'salary',
    date: '15/06/2025',
    type: 'income'
  },
  {
    id: 4,
    title: 'Tiền thuê nhà',
    amount: -3000000,
    category: 'housing',
    date: '10/06/2025',
    type: 'expense'
  },
];

export const navigationItems = [
  { key: 'home', label: 'Trang chủ', icon: 'home' },
  { key: 'transactions', label: 'Giao dịch', icon: 'exchange-alt' },
  { key: 'statistics', label: 'Thống kê', icon: 'chart-pie' },
  { key: 'settings', label: 'Cài đặt', icon: 'cog' },
];

export const bottomNavItems = [
  { key: 'home', label: 'Trang chủ', icon: 'home' },
  { key: 'transactions', label: 'Giao dịch', icon: 'exchange-alt' },
  { key: 'add', label: 'Thêm', icon: 'plus' },
  { key: 'statistics', label: 'Thống kê', icon: 'chart-pie' },
  { key: 'settings', label: 'Cài đặt', icon: 'cog' },
]; 