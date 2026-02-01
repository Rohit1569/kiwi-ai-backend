const User = require('../models/User');
const UsageStats = require('../models/UsageStats');
const PendingUser = require('../models/PendingUser');
const jwt = require('jsonwebtoken');
const { sendOTP } = require('../utils/email');

const signup = async (userData) => {
  console.log('--- SIGNUP PROTOCOL INITIATED ---');
  const { email, name, password } = userData;
  
  if (!email || !name || !password) {
    throw new Error('MISSING_REQUIRED_FIELDS');
  }

  const normalizedEmail = email.toLowerCase().trim();

  try {
    // 1. Check permanent database
    const existingUser = await User.findOne({ where: { email: normalizedEmail } });
    if (existingUser) throw new Error('USER_ALREADY_EXISTS');

    // 2. Generate OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    // 3. Clear old pending and create new record
    await PendingUser.destroy({ where: { email: normalizedEmail } }); 
    await PendingUser.create({
      email: normalizedEmail,
      name,
      password, 
      otp_code: otpCode,
      expires_at: new Date(Date.now() + 600000)
    });

    console.log(`--- DB PREP COMPLETE: OTP IS ${otpCode} ---`);

    // 4. Send Email BACKGROUND (Don't await to prevent Vercel Timeout)
    sendOTP(normalizedEmail, otpCode).catch(err => {
      console.error('BACKGROUND EMAIL FAILURE:', err.message);
    });

    return { email: normalizedEmail, status: "VERIFICATION_REQUIRED" };
  } catch (error) {
    console.error('SIGNUP LOGIC ERROR:', error.message);
    throw error;
  }
};

const verifyOtp = async (email, code) => {
  const normalizedEmail = email.toLowerCase().trim();
  const pending = await PendingUser.findOne({ 
    where: { email: normalizedEmail, otp_code: code.trim() },
    order: [['created_at', 'DESC']]
  });

  if (!pending) throw new Error('INVALID_OTP');
  if (new Date() > pending.expires_at) throw new Error('OTP_EXPIRED');

  // Move to permanent table
  const user = await User.create({
    email: pending.email,
    name: pending.name,
    password: pending.password, 
    is_verified: true
  }, { hooks: false });

  await UsageStats.create({ user_id: user.id });
  await pending.destroy();

  return true;
};

const login = async (email, password) => {
  const normalizedEmail = email.toLowerCase().trim();
  const user = await User.findOne({ where: { email: normalizedEmail } });
  if (!user) throw new Error('USER_NOT_FOUND');
  
  const isPasswordValid = await user.validPassword(password);
  if (!isPasswordValid) throw new Error('INVALID_PASSWORD');

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '30d' });
  return { user, token };
};

module.exports = { signup, verifyOtp, login };
