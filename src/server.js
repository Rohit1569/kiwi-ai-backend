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

// 1. FORCED SETUP ROUTE (Top Priority)
app.get('/api/setup', async (req, res) => {
  try {
    console.log('Starting Database Synchronization...');
    await sequelize.authenticate();
    await sequelize.sync({ alter: true }); 
    res.json({ 
      status: "SUCCESS",
      message: "Neural Database Protocols Synchronized.",
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    console.error('Setup Failed:', err.message);
    res.status(500).json({ status: "ERROR", error: err.message });
  }
});

// 2. Health Check
app.get('/api/health', (req, res) => res.json({ status: 'OK', service: 'APPLE AI' }));

// 3. Database connection middleware for other routes
app.use(async (req, res, next) => {
  try {
    await sequelize.authenticate();
    next();
  } catch (err) {
    res.status(503).json({ error: 'Database offline' });
  }
});

// 4. Feature Routes
app.use('/api/auth', authRoutes);
app.use('/api/usage', usageRoutes);

// Root Route
app.get('/', (req, res) => res.send('<h1>APPLE AI CORE IS ACTIVE</h1><p>Visit /api/setup to initialize.</p>'));

if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5002;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Development server running on port ${PORT}`);
  });
}

module.exports = app;
