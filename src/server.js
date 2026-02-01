require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const sequelize = require('./config/database');

// Import Models to ensure they are available for sync
const User = require('./models/User');
const UsageStats = require('./models/UsageStats');
const Otp = require('./models/Otp');
const PendingUser = require('./models/PendingUser');
const PasswordResetToken = require('./models/PasswordResetToken');

// Import Routes
const authRoutes = require('./routes/authRoutes');
const usageRoutes = require('./routes/usageRoutes');

const app = express();

// Middleware
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());

// Request Logger
app.use((req, res, next) => {
  if (req.path !== '/favicon.ico') {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  }
  next();
});

// Database connection check
let isDbConnected = false;
const connectDb = async () => {
  if (isDbConnected) return;
  try {
    await sequelize.authenticate();
    isDbConnected = true;
    console.log('PostgreSQL Protocol Active.');
  } catch (error) {
    console.error('DATABASE CONNECTION ERROR:', error.message);
  }
};

// Health Check
app.get('/api/health', async (req, res) => {
  await connectDb();
  res.json({ status: 'OK', database: isDbConnected ? 'Connected' : 'Offline' });
});

// One-time manual sync route (RESTORED)
app.get('/api/admin/sync', async (req, res) => {
  try {
    console.log('Starting manual database sync...');
    await sequelize.authenticate();
    // This creates tables if they don't exist and updates schema
    await sequelize.sync({ alter: true }); 
    res.json({ status: "SUCCESS", message: "Database schema synchronized successfully." });
  } catch (err) {
    console.error('SYNC ERROR:', err);
    res.status(500).json({ status: "ERROR", error: err.message });
  }
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/usage', usageRoutes);

app.get('/', (req, res) => res.send('APPLE AI CORE IS ACTIVE. Visit /api/admin/sync to initialize DB.'));

// Favicon handlers
app.get('/favicon.ico', (req, res) => res.status(204).end());

if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5002;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running locally on port ${PORT}`);
  });
}

module.exports = app;
