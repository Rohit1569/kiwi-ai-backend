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

// Middleware
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: '*', credentials: true })); // Explicit CORS for mobile
app.use(express.json());

// Database connection helper
let isDbSynced = false;
const syncDb = async () => {
  if (isDbSynced) return;
  try {
    await sequelize.authenticate();
    isDbSynced = true;
    console.log('PostgreSQL Connected.');
  } catch (error) {
    console.error('Database connection failed:', error.message);
  }
};

// Middleware to ensure DB connection
app.use(async (req, res, next) => {
  await syncDb();
  next();
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/usage', usageRoutes);

app.get('/', (req, res) => res.send('APPLE AI API is running...'));

// For local development
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5002;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

module.exports = app;
