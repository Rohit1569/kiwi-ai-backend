require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { sequelize } = require('./config/database');

const app = express();

console.log('>>> APPLE AI CORE STARTING - VERSION 1.0.5');

app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());

// Import Routes
const authRoutes = require('./routes/authRoutes');
const usageRoutes = require('./routes/usageRoutes');
const financeRoutes = require('./routes/financeRoutes');
const productivityRoutes = require('./routes/productivityRoutes'); // NEW

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/usage', usageRoutes);
app.use('/api/finance', financeRoutes);
app.use('/api/productivity', productivityRoutes); // NEW

app.get('/', (req, res) => res.send('APPLE AI CORE V1.0.5 ACTIVE'));

const PORT = process.env.PORT || 5002;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n--- SERVER READY ---`);
  console.log(`Listening on: http://0.0.0.0:${PORT}`);
  console.log(`Status: BROADCASTING to local network`);
  console.log(`--------------------\n`);
});

module.exports = app;
