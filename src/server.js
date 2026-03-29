require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { sequelize } = require('./config/database');
const authenticate = require('./middleware/authMiddleware');
const checkSubscription = require('./middleware/subscriptionMiddleware');

const app = express();

console.log('>>> APPLE AI CORE STARTING - VERSION 1.1.2');

app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());

// Import Routes
const authRoutes = require('./routes/authRoutes');
const usageRoutes = require('./routes/usageRoutes');
const financeRoutes = require('./routes/financeRoutes');
const productivityRoutes = require('./routes/productivityRoutes');
const fitnessRoutes = require('./routes/fitnessRoutes');
const adminRoutes = require('./routes/adminRoutes');
const subscriptionRoutes = require('./routes/subscriptionRoutes');

// Public Routes
app.use('/api/auth', authRoutes);

// Admin Routes (Only Authentication + isAdmin check inside adminRoutes)
app.use('/api/admin', adminRoutes);

// Protected Routes with Authentication and Subscription Check
app.use('/api/subscriptions', authenticate, subscriptionRoutes); 
app.use('/api/usage', authenticate, checkSubscription, usageRoutes);
app.use('/api/finance', authenticate, checkSubscription, financeRoutes);
app.use('/api/productivity', authenticate, checkSubscription, productivityRoutes);
app.use('/api/fitness', authenticate, checkSubscription, fitnessRoutes);

app.get('/', (req, res) => res.send('APPLE AI CORE V1.1.2 ACTIVE'));

// Start Cron Jobs
require('./utils/cronJobs');

const PORT = process.env.PORT || 5002;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n--- SERVER READY ---`);
  console.log(`Listening on: http://0.0.0.0:${PORT}`);
  console.log(`Status: BROADCASTING to local network`);
  console.log(`--------------------\n`);
});

module.exports = app;
