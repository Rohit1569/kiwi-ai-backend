const User = require('../models/User');
const UsageStats = require('../models/UsageStats');
const PendingUser = require('../models/PendingUser');
const Otp = require('../models/Otp');
const jwt = require('jsonwebtoken');
const { sendOTP } = require('../utils/email');

const signup = async (userData) => {
  console.log('>>> [SERVICE] signup started');
  const { email, name, password } = userData;
  
  if (!email || !name || !password) {
    console.error('>>> [SERVICE] validation failed: missing fields');
    throw new Error('MISSING_FIELDS');
  }

  const normalizedEmail = email.toLowerCase().trim();

  try {
    console.log('>>> [SERVICE] checking existing user');
    const existingUser = await User.findOne({ where: { email: normalizedEmail } });
    if (existingUser) {
      console.warn('>>> [SERVICE] user already exists');
      throw new Error('ALREADY_EXISTS');
    }

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    console.log('>>> [SERVICE] generated OTP:', otpCode);

    console.log('>>> [SERVICE] clearing old pending records');
    await PendingUser.destroy({ where: { email: normalizedEmail } }); 
    
    console.log('>>> [SERVICE] creating pending user');
    await PendingUser.create({
      email: normalizedEmail,
      name,
      password, 
      otp_code: otpCode,
      expires_at: new Date(Date.now() + 600000)
    });

    console.log('>>> [SERVICE] initiating email dispatch');
    sendOTP(normalizedEmail, otpCode).catch(err => {
      console.error('>>> [CRITICAL] email failed in background:', err.message);
    });

    console.log('>>> [SERVICE] signup successful');
    return { email: normalizedEmail };
  } catch (error) {
    console.error('>>> [SERVICE] signup caught error:', error.message);
    throw error;
  }
};

const verifyOtp = async (email, code) => {
  console.log('>>> [SERVICE] verifyOtp started for', email);
  const normalizedEmail = email.toLowerCase().trim();
  
  try {
    const pending = await PendingUser.findOne({ 
      where: { email: normalizedEmail, otp_code: code.trim() },
      order: [['created_at', 'DESC']]
    });

    if (!pending) {
      console.warn('>>> [SERVICE] no pending user found for OTP');
      throw new Error('INVALID_CODE');
    }
    
    if (new Date() > pending.expires_at) {
      console.warn('>>> [SERVICE] OTP expired');
      throw new Error('EXPIRED');
    }

    console.log('>>> [SERVICE] creating permanent user');
    const user = await User.create({
      email: pending.email,
      name: pending.name,
      password: pending.password, 
      is_verified: true
    }, { hooks: false });

    console.log('>>> [SERVICE] initializing usage stats');
    await UsageStats.create({ user_id: user.id });
    
    console.log('>>> [SERVICE] cleanup: destroying pending record');
    await pending.destroy();

    return true;
  } catch (error) {
    console.error('>>> [SERVICE] verifyOtp error:', error.message);
    throw error;
  }
};

const login = async (email, password) => {
  console.log('>>> [SERVICE] login started for', email);
  const normalizedEmail = email.toLowerCase().trim();
  
  try {
    const user = await User.findOne({ where: { email: normalizedEmail } });
    if (!user) {
      console.warn('>>> [SERVICE] login failed: user not found');
      throw new Error('NOT_FOUND');
    }

    const isPasswordValid = await user.validPassword(password);
    if (!isPasswordValid) {
      console.warn('>>> [SERVICE] login failed: invalid password');
      throw new Error('INVALID_PASS');
    }

    console.log('>>> [SERVICE] login successful');
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '30d' });
    return { user, token };
  } catch (error) {
    console.error('>>> [SERVICE] login error:', error.message);
    throw error;
  }
};

const generateResetToken = async (email) => {
  const normalizedEmail = email.toLowerCase().trim();
  const user = await User.findOne({ where: { email: normalizedEmail } });
  if (!user) throw new Error('NOT_FOUND');

  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
  await Otp.create({
    email: normalizedEmail,
    code: otpCode,
    expires_at: new Date(Date.now() + 600000)
  });

  sendOTP(normalizedEmail, otpCode).catch(e => console.error('Reset mail failed', e));
  return otpCode;
};

const resetPassword = async (email, otp, newPassword) => {
  const normalizedEmail = email.toLowerCase().trim();
  const otpRecord = await Otp.findOne({
    where: { email: normalizedEmail, code: otp.trim() },
    order: [['created_at', 'DESC']]
  });

  if (!otpRecord || new Date() > otpRecord.expires_at) {
    throw new Error('INVALID_CODE');
  }

  const user = await User.findOne({ where: { email: normalizedEmail } });
  user.password = newPassword;
  await user.save();
  await otpRecord.destroy();
  return true;
};

module.exports = { signup, verifyOtp, login, generateResetToken, resetPassword };
