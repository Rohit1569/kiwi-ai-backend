const authService = require('../services/authService');
const User = require('../models/User');

const signup = async (req, res) => {
  try {
    const user = await authService.signup(req.body);
    res.status(201).json({ status: 'SUCCESS', message: 'Verification code dispatched.', email: user.email });
  } catch (error) {
    res.status(400).json({ status: 'ERROR', message: error.message });
  }
};

const verifyOtp = async (req, res) => {
  try {
    const { email, otp, deviceId } = req.body;
    await authService.verifyOtp(email, otp, deviceId);
    res.json({ status: 'SUCCESS', message: 'Identity verified.' });
  } catch (error) {
    res.status(400).json({ status: 'ERROR', message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password, deviceId } = req.body;
    console.log(`>>> [AUTH] Login attempt for: ${email} from device: ${deviceId}`);
    const { user, token } = await authService.login(email, password, deviceId);
    console.log(`>>> [AUTH SUCCESS] Login successful for: ${email}`);
    res.json({ 
      status: 'SUCCESS', 
      token, 
      user: { 
        id: user.id, 
        name: user.name, 
        email: user.email,
        role: user.role 
      } 
    });
  } catch (error) {
    console.error(`!!! [AUTH ERROR] Login failed for: ${req.body.email}. Error: ${error.message}`);
    res.status(401).json({ status: 'ERROR', message: error.message });
  }
};

const saveVoicePrint = async (req, res) => {
  try {
    const { voiceSignature } = req.body;
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    await user.update({ voice_signature: voiceSignature });
    res.json({ status: 'SUCCESS', message: 'Biometric voiceprint secured.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    await authService.generateResetToken(email);
    res.json({ status: 'SUCCESS', message: 'Recovery code dispatched.' });
  } catch (error) {
    res.status(404).json({ status: 'ERROR', message: error.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    await authService.resetPassword(email, otp, newPassword);
    res.json({ status: 'SUCCESS', message: 'Password updated successfully.' });
  } catch (error) {
    res.status(400).json({ status: 'ERROR', message: error.message });
  }
};

// EXPLICIT EXPORT OBJECT
module.exports = {
  signup,
  verifyOtp,
  login,
  saveVoicePrint,
  forgotPassword,
  resetPassword
};
