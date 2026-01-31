require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const sequelize = require('./config/database');

// Import Models
const User = require('./models/User');
const UsageStats = require('./models/UsageStats');
const Otp = require('./models/Otp');
const PendingUser = require('./models/PendingUser');
const PasswordResetToken = require('./models/PasswordResetToken');

// Import Routes
const authRoutes = require('./routes/authRoutes');
const usageRoutes = require('./routes/usageRoutes');

const app = express();

app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors());
app.use(express.json());

// Database connection helper (No sync here!)
let isDbAuthenticated = false;
const connectDb = async () => {
  if (isDbAuthenticated) return;
  try {
    await sequelize.authenticate();
    isDbAuthenticated = true;
    console.log('Neon Tech Database Connected.');
  } catch (error) {
    console.error('DATABASE CONNECTION ERROR:', error.message);
    throw error;
  }
};

// ONE-TIME SETUP ROUTE: Call this once to create/fix tables
app.get('/api/setup', async (req, res) => {
  try {
    await sequelize.authenticate();
    // Force sync tables - ONLY RUN THIS ONCE OR WHEN SCHEMA CHANGES
    await sequelize.sync({ alter: true }); 
    res.json({ message: "Database tables synchronized successfully." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Health Check
app.get('/api/health', async (req, res) => {
  try {
    await connectDb();
    res.json({ status: 'OK', database: 'Connected' });
  } catch (err) {
    res.status(500).json({ status: 'Error', message: err.message });
  }
});

// Middleware to ensure DB is connected
app.use(async (req, res, next) => {
  try {
    await connectDb();
    next();
  } catch (err) {
    res.status(503).json({ error: 'Service Unavailable: Database Connection Failed' });
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/usage', usageRoutes);

app.get('/', (req, res) => res.send('APPLE AI API is active.'));

if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5002;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

module.exports = app;
