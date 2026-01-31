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

// Database connection & sync logic for Serverless
let isDbInitialised = false;
const initDb = async () => {
  if (isDbInitialised) return;
  try {
    await sequelize.authenticate();
    // This creates tables if they don't exist
    await sequelize.sync({ alter: true }); 
    isDbInitialised = true;
    console.log('Neon Tech Database Initialised.');
  } catch (error) {
    console.error('DATABASE INIT ERROR:', error.message);
    throw error;
  }
};

// Health Check with DB Status
app.get('/api/health', async (req, res) => {
  try {
    await initDb();
    res.json({ status: 'OK', database: 'Connected' });
  } catch (err) {
    res.status(500).json({ status: 'Error', message: err.message });
  }
});

// Middleware to ensure DB is ready for any API call
app.use(async (req, res, next) => {
  try {
    await initDb();
    next();
  } catch (err) {
    res.status(503).json({ error: 'Database initializing, please retry in a moment.' });
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
