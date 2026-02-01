const User = require('../models/User');
const UsageStats = require('../models/UsageStats');
const PendingUser = require('../models/PendingUser');
const Otp = require('../models/Otp');
const jwt = require('jsonwebtoken');
const { sendOTP } = require('../utils/email');

const signup = async (userData) => {
  console.log('>>> [SIGNUP START] Data received:', JSON.stringify(userData));
  const { email, name, password } = userData;
  
  if (!email || !name || !password) {
    console.error('>>> [SIGNUP FAIL] Missing required fields');
    throw new Error('MISSING_FIELDS');
  }

  const normalizedEmail = email.toLowerCase().trim();

  try {
    console.log('>>> [SIGNUP STEP 1] Checking existing user');
    const existingUser = await User.findOne({ where: { email: normalizedEmail } });
    if (existingUser) {
      console.warn('>>> [SIGNUP FAIL] User already exists');
      throw new Error('ALREADY_EXISTS');
    }

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    console.log('>>> [SIGNUP STEP 2] Generated OTP:', otpCode);

    console.log('>>> [SIGNUP STEP 3] Cleaning up old pending records');
    await PendingUser.destroy({ where: { email: normalizedEmail } }); 
    
    console.log('>>> [SIGNUP STEP 4] Creating pending user');
    const pending = await PendingUser.create({
      email: normalizedEmail,
      name,
      password, 
      otp_code: otpCode,
      expires_at: new Date(Date.now() + 600000)
    });
    console.log('>>> [SIGNUP STEP 5] Pending user created ID:', pending.id);

    console.log('>>> [SIGNUP STEP 6] Initiating background email dispatch');
    sendOTP(normalizedEmail, otpCode).catch(err => {
      console.error('>>> [CRITICAL] Email system failure:', err.message);
    });

    console.log('>>> [SIGNUP SUCCESS] Returning response');
    return { email: normalizedEmail };
  } catch (error) {
    console.error('>>> [SIGNUP ERROR] Full Stack Trace:', error);
    throw error;
  }
};

const verifyOtp = async (email, code) => {
  console.log(`>>> [VERIFY START] Email: ${email}, Code: ${code}`);
  const normalizedEmail = email.toLowerCase().trim();
  
  try {
    const pending = await PendingUser.findOne({ 
      where: { email: normalizedEmail, otp_code: code.trim() },
      order: [['created_at', 'DESC']]
    });

    if (!pending) {
      console.warn('>>> [VERIFY FAIL] Invalid OTP or Email match');
      throw new Error('INVALID_CODE');
    }
    
    if (new Date() > pending.expires_at) {
      console.warn('>>> [VERIFY FAIL] OTP has expired');
      throw new Error('EXPIRED');
    }

    console.log('>>> [VERIFY STEP 1] Moving to permanent User table');
    const user = await User.create({
      email: pending.email,
      name: pending.name,
      password: pending.password, // This is already the hash from PendingUser
      is_verified: true
    }, { hooks: false });

    console.log('>>> [VERIFY STEP 2] Initializing UsageStats');
    await UsageStats.create({ user_id: user.id });
    
    console.log('>>> [VERIFY STEP 3] Deleting pending record');
    await pending.destroy();

    console.log('>>> [VERIFY SUCCESS]');
    return true;
  } catch (error) {
    console.error('>>> [VERIFY ERROR]:', error.message);
    throw error;
  }
};

const login = async (email, password) => {
  console.log('>>> [LOGIN START] Email:', email);
  const normalizedEmail = email.toLowerCase().trim();
  
  try {
    const user = await User.findOne({ where: { email: normalizedEmail } });
    if (!user) {
      console.warn('>>> [LOGIN FAIL] User not found');
      throw new Error('NOT_FOUND');
    }

    const isPasswordValid = await user.validPassword(password);
    if (!isPasswordValid) {
      console.warn('>>> [LOGIN FAIL] Invalid credentials');
      throw new Error('INVALID_PASS');
    }

    console.log('>>> [LOGIN SUCCESS]');
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '30d' });
    return { user, token };
  } catch (error) {
    console.error('>>> [LOGIN ERROR]:', error.message);
    throw error;
  }
};

module.exports = { signup, verifyOtp, login };
