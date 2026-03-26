const jwt = require('jsonwebtoken');
const { User } = require('../models');

const authenticate = async (req, res, next) => {
  const authHeader = req.header('Authorization');
  
  if (!authHeader) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = authHeader.replace('Bearer ', '');
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // SECURITY FIX: Check if user still exists and is active in the database
    // This prevents blocked users with valid JWTs from accessing the API
    const user = await User.findByPk(decoded.id);
    
    if (!user) {
      return res.status(401).json({ error: 'User no longer exists' });
    }
    
    if (!user.is_active) {
      return res.status(403).json({ 
        error: 'Account disabled', 
        message: 'Your account has been disabled by an administrator.' 
      });
    }

    req.user = decoded;
    next();
  } catch (error) {
    console.error('!!! [AUTH FAIL] JWT Verification Failed:', error.message);
    res.status(401).json({ error: 'Authentication failed', detail: error.message });
  }
};

module.exports = authenticate;
