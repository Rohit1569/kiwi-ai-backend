const authService = require('../services/authService');

const signup = async (req, res) => {
  console.log('--- [AUTH CONTROLLER] SIGNUP ATTEMPT ---');
  console.log('Payload received:', JSON.stringify(req.body, null, 2));
  try {
    const result = await authService.signup(req.body);
    console.log('Signup logic success for:', result.email);
    res.status(201).json({ 
      status: 'SUCCESS',
      message: 'Verification code dispatched to email.', 
      email: result.email 
    });
  } catch (error) {
    console.error('--- [AUTH CONTROLLER] SIGNUP CRITICAL ERROR ---');
    console.error('Error Stack:', error.stack);
    console.error('Error Message:', error.message);
    res.status(400).json({ 
      error: 'SIGNUP_FAILED', 
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
};

const verifyOtp = async (req, res) => {
  console.log('--- [AUTH CONTROLLER] OTP VERIFICATION ATTEMPT ---');
  try {
    const { email, otp } = req.body;
    console.log('Data:', { email, otp });
    await authService.verifyOtp(email, otp);
    console.log('OTP verified for:', email);
    res.json({ status: 'SUCCESS', message: 'Identity verified.' });
  } catch (error) {
    console.error('--- [AUTH CONTROLLER] OTP ERROR ---');
    console.error(error.message);
    res.status(400).json({ error: 'VERIFICATION_FAILED', message: error.message });
  }
};

const login = async (req, res) => {
  console.log('--- [AUTH CONTROLLER] LOGIN ATTEMPT ---');
  try {
    const { email, password } = req.body;
    const { user, token } = await authService.login(email, password);
    console.log('Login successful for user:', user.id);
    res.json({ status: 'SUCCESS', token, user: { id: user.id, name: user.name, email: user.email } });
  } catch (error) {
    console.error('--- [AUTH CONTROLLER] LOGIN FAILURE ---');
    console.error(error.message);
    res.status(401).json({ error: 'AUTHENTICATION_FAILED', message: error.message });
  }
};

const forgotPassword = async (req, res) => {
  console.log('--- [AUTH CONTROLLER] FORGOT PASSWORD INITIATED ---');
  try {
    const { email } = req.body;
    await authService.generateResetToken(email);
    console.log('Reset code sent to:', email);
    res.json({ status: 'SUCCESS', message: 'Recovery code dispatched.' });
  } catch (error) {
    console.error('--- [AUTH CONTROLLER] FORGOT PASS ERROR ---');
    res.status(404).json({ error: 'USER_NOT_FOUND', message: error.message });
  }
};

const resetPassword = async (req, res) => {
  console.log('--- [AUTH CONTROLLER] PASSWORD RESET ATTEMPT ---');
  try {
    const { email, otp, newPassword } = req.body;
    await authService.resetPassword(email, otp, newPassword);
    console.log('Password updated for:', email);
    res.json({ status: 'SUCCESS', message: 'Credentials updated successfully.' });
  } catch (error) {
    console.error('--- [AUTH CONTROLLER] RESET PASS ERROR ---');
    res.status(400).json({ error: 'RESET_FAILED', message: error.message });
  }
};

module.exports = { signup, verifyOtp, login, forgotPassword, resetPassword };
