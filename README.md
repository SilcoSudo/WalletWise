# Expense Management App

Ứng dụng quản lý chi tiêu full-stack với React Native (Frontend) và Node.js/Express/MongoDB (Backend).

## 🏗️ Cấu trúc dự án

```
fetest-expense/
├── backend/                    # Backend API (Node.js/Express/MongoDB)
│   ├── src/
│   │   ├── controllers/       # Logic xử lý API
│   │   ├── models/           # MongoDB schemas
│   │   ├── routes/           # API routes
│   │   ├── middleware/       # Middleware
│   │   ├── config/           # Cấu hình
│   │   └── utils/            # Hàm tiện ích
│   ├── .env                  # Biến môi trường
│   ├── package.json          # Dependencies backend
│   └── server.js             # Entry point
├── frontend/                  # React Native App (Expo)
│   ├── src/
│   │   ├── components/       # Components tái sử dụng
│   │   ├── screens/          # Các màn hình
│   │   ├── hooks/            # Custom hooks
│   │   ├── navigation/       # Navigation
│   │   ├── utils/            # Hàm tiện ích
│   │   ├── styles/           # Styling
│   │   └── assets/           # Tài nguyên
│   ├── App.js                # Entry point
│   ├── package.json          # Dependencies frontend
│   └── app.json              # Cấu hình Expo
└── package.json              # Monorepo scripts
```

## 🚀 Tính năng

### Frontend (React Native/Expo)
- ✅ **Navigation**: Drawer + Bottom Tabs
- ✅ **Screens**: Home, Transactions, Statistics, Settings, Login
- ✅ **Dark Mode**: Hỗ trợ chế độ tối/sáng
- ✅ **Charts**: Biểu đồ tròn và cột với react-native-chart-kit
- ✅ **UI/UX**: Gradient backgrounds, modern design
- ✅ **Categories**: 8 danh mục chi tiêu chính
- ✅ **Add Transaction**: Modal thêm giao dịch với chọn danh mục

### Backend (Node.js/Express/MongoDB)
- 🔄 **Authentication**: JWT-based auth system
- 🔄 **CRUD Operations**: Quản lý giao dịch, danh mục
- 🔄 **Statistics**: API thống kê chi tiêu
- 🔄 **User Management**: Quản lý hồ sơ người dùng

## 📱 Screenshots

### Home Screen
- Số dư hiện tại với gradient card
- Danh mục chi tiêu với icons
- Giao dịch gần đây

### Statistics Screen
- Biểu đồ tròn phân bổ chi tiêu
- Biểu đồ cột theo thời gian
- Tabs: Ngày/Tuần/Tháng

### Transactions Screen
- Danh sách giao dịch với filter
- Search functionality
- Tabs: Tất cả/Chi tiêu/Thu nhập

## 🛠️ Cài đặt

### Yêu cầu hệ thống
- Node.js (v16+)
- Yarn hoặc npm
- Expo CLI
- MongoDB (cho backend)

### Bước 1: Clone repository
```bash
git clone <repository-url>
cd fetest-expense
```

### Bước 2: Cài đặt dependencies
```bash
# Cài đặt tất cả dependencies
npm run install:all

# Hoặc cài đặt riêng lẻ
npm install                    # Root dependencies
cd backend && npm install      # Backend dependencies
cd ../frontend && yarn install # Frontend dependencies
```

### Bước 3: Cấu hình Backend
```bash
cd backend
cp .env.example .env
# Chỉnh sửa .env với thông tin MongoDB và JWT secret
```

### Bước 4: Chạy ứng dụng

#### Chạy cả Frontend và Backend
```bash
npm start
```

#### Chạy riêng lẻ
```bash
# Backend
npm run start:backend

# Frontend
npm run start:frontend
```

## 🔧 Scripts

| Script | Mô tả |
|--------|-------|
| `npm start` | Chạy cả backend và frontend |
| `npm run dev` | Chạy ở chế độ development |
| `npm run install:all` | Cài đặt tất cả dependencies |
| `npm run build` | Build frontend |
| `npm run test` | Chạy tests |

## 📊 Công nghệ sử dụng

### Frontend
- **React Native** - Mobile app framework
- **Expo** - Development platform
- **NativeWind** - Tailwind CSS cho React Native
- **React Navigation** - Navigation library
- **React Native Chart Kit** - Charts và biểu đồ
- **Expo Linear Gradient** - Gradient backgrounds
- **React Native Vector Icons** - Icons

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM cho MongoDB
- **JWT** - Authentication
- **bcrypt** - Password hashing

## 🎨 Design System

### Colors
- **Primary**: Blue gradient (#667eea → #764ba2)
- **Secondary**: Pink gradient (#ff9a9e → #fecfef)
- **Success**: Green (#10b981)
- **Error**: Red (#ef4444)
- **Dark Mode**: Gray scale (#1a1a1a, #374151, #6b7280)

### Typography
- **Font**: System fonts
- **Sizes**: xs, sm, base, lg, xl, 2xl
- **Weights**: normal, medium, semibold, bold

## 🔐 Authentication

### Guest Mode
- Lưu dữ liệu vào AsyncStorage
- Không cần đăng nhập
- Chức năng cơ bản

### User Mode
- JWT authentication
- Đồng bộ dữ liệu với server
- Backup và restore
- Multi-device sync

## 📈 Roadmap

### Phase 1: Core Features ✅
- [x] Basic UI/UX
- [x] Navigation system
- [x] Dark mode
- [x] Charts và statistics
- [x] Transaction management

### Phase 2: Backend Integration 🔄
- [ ] API development
- [ ] Database setup
- [ ] Authentication system
- [ ] Data synchronization

### Phase 3: Advanced Features 📋
- [ ] Budget management
- [ ] Export/Import data
- [ ] Push notifications
- [ ] Offline support
- [ ] Multi-currency

### Phase 4: Enhancement 🚀
- [ ] AI insights
- [ ] Social features
- [ ] Advanced analytics
- [ ] Mobile optimization

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Your Name**
- Email: truongquy445@gmail.com
- GitHub: [@SilcoSudo](https://github.com/SilcoSudo)

## 🙏 Acknowledgments

- [Expo](https://expo.dev/) - Development platform
- [React Native](https://reactnative.dev/) - Mobile framework
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [React Native Chart Kit](https://github.com/indiespirit/react-native-chart-kit) - Charts library

## Project Structure

- `frontend/` - React Native mobile app
- `backend/` - Node.js/Express API server

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory with the following content:
```
MONGODB_URI=mongodb://localhost:27017/expense-tracker
JWT_SECRET=your-secret-key-here
PORT=5000
```

4. Make sure MongoDB is running on your system

5. Start the backend server:
```bash
npm start
```

The server will start on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the React Native development server:
```bash
npx expo start
```

## Testing the Connection

To test if the backend is working properly:

1. Make sure the backend is running on `http://localhost:5000`
2. Open your browser and go to `http://localhost:5000/api/health`
3. You should see a JSON response: `{"message":"Server is running","timestamp":"..."}`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/guest` - Guest login

### Transactions
- `GET /api/transactions` - Get all transactions
- `POST /api/transactions` - Create new transaction
- `PUT /api/transactions/:id` - Update transaction
- `DELETE /api/transactions/:id` - Delete transaction

### Statistics
- `GET /api/stats` - Get expense statistics

## Troubleshooting

### Login Issues
If you're experiencing login issues:

1. Make sure the backend server is running
2. Check the console logs for any API errors
3. Verify that MongoDB is running and accessible
4. Check that the API base URL in `frontend/src/utils/api.js` matches your backend URL

### Navigation Issues
If the app doesn't navigate to HomeScreen after login:

1. Check the console logs for authentication state changes
2. Verify that the `useAuth` hook is properly updating the user state
3. Ensure that the `isAuthenticated` value is being set correctly

## Features

- User authentication (login/register/guest)
- Expense and income tracking
- Category management
- Statistics and reports
- Dark/light theme support
- Offline data storage with AsyncStorage
