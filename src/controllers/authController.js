const authService = require('../services/authService');

const signup = async (req, res) => {
  try {
    const user = await authService.signup(req.body);
    res.status(201).json({ 
      message: 'User registered. Check your email.', 
      email: user.email 
    });
  } catch (error) {
    console.error('SIGNUP ERROR:', error.message);
    res.status(400).json({ error: error.message });
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

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    await authService.generateResetToken(email);
    res.json({ message: 'Password reset OTP sent to your email.' });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    await authService.resetPassword(email, otp, newPassword);
    res.json({ message: 'Password reset successfully.' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { signup, verifyOtp, login, forgotPassword, resetPassword };
