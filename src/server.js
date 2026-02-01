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

// 1. Production Security & Logging
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());

// Request Logger (Black Box)
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path} - IP: ${req.ip}`);
  next();
});

// 2. FORCED SETUP ROUTE (Top Priority)
app.get('/api/setup', async (req, res) => {
  console.log('--- SYSTEM SETUP INITIATED ---');
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true }); 
    console.log('--- DATABASE SCHEMA SYNCED SUCCESSFULLY ---');
    return res.status(200).json({ 
      status: "SUCCESS",
      message: "Neural Database Protocols Synchronized."
    });
  } catch (err) {
    console.error('--- SETUP CRITICAL FAILURE ---');
    console.error(err);
    return res.status(500).json({ 
      error: "DATABASE_SYNC_FAILED", 
      message: err.message 
    });
  }
});

// 3. Health Check
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'ONLINE', 
    engine: 'APPLE AI',
    database: sequelize.options.host 
  });
});

// 4. Database Persistence Middleware
app.use(async (req, res, next) => {
  try {
    if (req.path === '/' || req.path === '/api/setup' || req.path === '/api/health') return next();
    await sequelize.authenticate();
    next();
  } catch (err) {
    console.error('[CRITICAL] Database Authentication Timeout:', err.message);
    return res.status(503).json({ 
      error: "DATABASE_OFFLINE", 
      message: "The robotic core cannot reach PostgreSQL." 
    });
  }
});

// 5. Feature Routes
app.use('/api/auth', authRoutes);
app.use('/api/usage', usageRoutes);

// Root UI
app.get('/', (req, res) => {
  res.status(200).send(`
    <body style="background:#000; color:#0FF; font-family:monospace; padding:50px;">
      <h1>APPLE AI CORE ACTIVE</h1>
      <p style="color:#FFF">System is monitoring all neural protocols.</p>
      <hr border="1" color="#0FF">
      <p>Endpoint: <b>${req.hostname}</b></p>
    </body>
  `);
});

// 6. Global 404 Handler
app.use((req, res) => {
  console.warn(`[404] Route Not Found: ${req.method} ${req.path}`);
  res.status(404).json({ error: "ROUTE_NOT_FOUND", message: "This neural path does not exist." });
});

// 7. Global Error Handler (The Shield)
app.use((err, req, res, next) => {
  console.error('[UNHANDLED EXCEPTION]:', err.stack);
  res.status(500).json({ 
    error: "INTERNAL_SERVER_ERROR", 
    message: "A core system fault occurred.",
    debug: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start locally
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5002;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`\n>>> APPLE AI HUD: http://localhost:${PORT}`);
  });
}

module.exports = app;
