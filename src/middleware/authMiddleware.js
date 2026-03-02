const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
  console.log('>>> [AUTH] Checking token...');
  const authHeader = req.header('Authorization');
  
  if (!authHeader) {
    console.error('!!! [AUTH FAIL] No Authorization Header found');
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = authHeader.replace('Bearer ', '');
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('>>> [AUTH SUCCESS] Token verified for User:', decoded.id);
    req.user = decoded;
    next();
  } catch (error) {
    console.error('!!! [AUTH FAIL] JWT Verification Failed:', error.message);
    console.error('Check if JWT_SECRET in .env matches the token source.');
    res.status(401).json({ error: 'Authentication failed', detail: error.message });
  }
};

module.exports = authenticate;
