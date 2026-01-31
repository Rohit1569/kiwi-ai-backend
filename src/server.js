require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const sequelize = require('./config/database');

// Import Models to ensure they are synchronized
const User = require('./models/User');
const UsageStats = require('./models/UsageStats');
const Otp = require('./models/Otp');
const PasswordResetToken = require('./models/PasswordResetToken');

// Import Routes
const authRoutes = require('./routes/authRoutes');
const usageRoutes = require('./routes/usageRoutes');

const app = express();

// Middleware
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/usage', usageRoutes);

app.get('/', (req, res) => res.send('APPLE AI API is running...'));

const PORT = process.env.PORT || 5002;

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected successfully.');
    
    // Force sync the specific OTP table
    await sequelize.sync({ alter: true }); 
    console.log('PostgreSQL Protocols Synchronized.');
    
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server is running on http://192.168.0.2:${PORT}`);
    });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

startServer();
