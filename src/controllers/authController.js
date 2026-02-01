const authService = require('../services/authService');

const signup = async (req, res) => {
  try {
    console.log('Signup Request Body:', req.body);
    const user = await authService.signup(req.body);
    res.status(201).json({ 
      message: 'User registered. Check your email.', 
      email: user.email 
    });
  } catch (error) {
    console.error('SIGNUP ERROR:', error.message);
    // Returning the actual error message helps us debug on the phone screen
    res.status(400).json({ error: error.message, detail: "Check Vercel logs for stack trace" });
  }
};

const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    await authService.verifyOtp(email, otp);
    res.json({ message: 'Verified' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { user, token } = await authService.login(email, password);
    res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

module.exports = { signup, verifyOtp, login };
