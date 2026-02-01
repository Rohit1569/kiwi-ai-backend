const authService = require('../services/authService');

const signup = async (req, res) => {
  console.log('--- [DEBUG] SIGNUP INITIATED ---');
  console.log('BODY:', JSON.stringify(req.body));
  
  try {
    const user = await authService.signup(req.body);
    res.status(201).json({ 
      status: 'SUCCESS',
      message: 'Verification code dispatched.', 
      email: user.email 
    });
  } catch (error) {
    console.error('--- [DEBUG] SIGNUP FAILED ---');
    console.error('MSG:', error.message);
    
    // Send the EXACT error to the phone screen
    res.status(400).json({ 
      status: 'ERROR',
      error: error.name || 'SIGNUP_ERROR',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    await authService.verifyOtp(email, otp);
    res.json({ status: 'SUCCESS', message: 'Identity verified.' });
  } catch (error) {
    res.status(400).json({ error: 'VERIFICATION_FAILED', message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { user, token } = await authService.login(email, password);
    res.json({ status: 'SUCCESS', token, user: { id: user.id, name: user.name, email: user.email } });
  } catch (error) {
    res.status(401).json({ error: 'AUTHENTICATION_FAILED', message: error.message });
  }
};

module.exports = { signup, verifyOtp, login };
