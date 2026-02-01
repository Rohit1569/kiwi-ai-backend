require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const sequelize = require('./config/database');

const app = express();

// 1. Logger (BEFORE EVERYTHING ELSE)
app.use((req, res, next) => {
  console.log(`\n>>> [REQUEST] ${req.method} ${req.path}`);
  console.log(`>>> [IP] ${req.ip}`);
  console.log(`>>> [HEADERS]`, req.headers['content-type']);
  next();
});

app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());

// 2. Body Logger (AFTER JSON PARSING)
app.use((req, res, next) => {
  if (req.method === 'POST') {
    console.log(`>>> [BODY]`, JSON.stringify(req.body, null, 2));
  }
  next();
});

// Import Routes
const authRoutes = require('./routes/authRoutes');
const usageRoutes = require('./routes/usageRoutes');

// Routes
app.get('/api/setup', async (req, res) => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true }); 
    res.json({ status: "SUCCESS" });
  } catch (err) {
    console.error('SETUP ERROR:', err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/health', (req, res) => res.json({ status: 'OK' }));
app.use('/api/auth', authRoutes);
app.use('/api/usage', usageRoutes);

app.get('/', (req, res) => res.send('APPLE AI ACTIVE'));

// Start locally
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5002;
  app.listen(PORT, '0.0.0.0', () => console.log(`Server at ${PORT}`));
}

module.exports = app;
