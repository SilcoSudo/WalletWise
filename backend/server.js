const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Import database connection
const connectDB = require('./src/config/db');

// Import routes
const authRoutes = require('./src/routes/authRoutes');
const transactionRoutes = require('./src/routes/transactionRoutes');
const categoryRoutes = require('./src/routes/categoryRoutes');
const statsRoutes = require('./src/routes/statsRoutes');
const settingsRoutes = require('./src/routes/settingsRoutes');
const profileRoutes = require('./src/routes/profileRoutes');

// Import middleware
const errorHandler = require('./src/middleware/errorMiddleware');

const app = express();

// Connect to database
connectDB();

// CORS configuration - allow all origins for development
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/profile', profileRoutes);

// Error handling middleware
app.use(errorHandler);

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ message: 'Server is running', timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Server accessible at:`);
  console.log(`  - http://localhost:${PORT}`);
  console.log(`  - http://127.0.0.1:${PORT}`);
  console.log(`  - http://[your-ip]:${PORT}`);
});
