const User = require('../models/User');
const UsageStats = require('../models/UsageStats');
const PendingUser = require('../models/PendingUser');
const jwt = require('jsonwebtoken');
const { sendOTP } = require('../utils/email');

const signup = async (userData) => {
  const { email, name, password } = userData;
  const normalizedEmail = email.toLowerCase().trim();

  const existingUser = await User.findOne({ where: { email: normalizedEmail } });
  if (existingUser) throw new Error('User already exists');

  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

  await PendingUser.destroy({ where: { email: normalizedEmail } }); 
  await PendingUser.create({
    email: normalizedEmail,
    name,
    password, 
    otp_code: otpCode,
    expires_at: new Date(Date.now() + 600000)
  });

  console.log(`--- OTP GENERATED: ${otpCode} for ${normalizedEmail} ---`);
  try {
    await sendOTP(normalizedEmail, otpCode);
  } catch (err) {
    console.error('Mail system error:', err.message);
    throw new Error('Verification email failed.');
  }

  return { email: normalizedEmail };
};

const verifyOtp = async (email, code) => {
  const normalizedEmail = email.toLowerCase().trim();
  console.log(`--- VERIFYING OTP: ${code} for ${normalizedEmail} ---`);
  
  const pending = await PendingUser.findOne({ 
    where: { email: normalizedEmail, otp_code: code.trim() },
    order: [['created_at', 'DESC']]
  });

  if (!pending) {
    console.error('Verification Failed: No matching record found');
    throw new Error('Invalid verification code');
  }
  
  if (new Date() > pending.expires_at) {
    console.error('Verification Failed: OTP expired');
    throw new Error('OTP has expired');
  }

  // CRITICAL FIX: Move the user to permanent table WITHOUT re-hashing the password
  // 'pending.password' is already hashed.
  // We use hooks: false to prevent the User model from hashing the hash again.
  const user = await User.create({
    email: pending.email,
    name: pending.name,
    password: pending.password, // Transfer the existing hash
    is_verified: true
  }, { hooks: false });

  await UsageStats.create({ user_id: user.id });
  await pending.destroy();

  console.log(`--- VERIFICATION SUCCESS: ${normalizedEmail} verified ---`);
  return true;
};

const login = async (email, password) => {
  const normalizedEmail = email.toLowerCase().trim();
  console.log(`--- LOGIN ATTEMPT: ${normalizedEmail} ---`);
  
  const user = await User.findOne({ where: { email: normalizedEmail } });
  if (!user) {
    console.error('Login Failed: User not found');
    throw new Error('User not found');
  }

  const isPasswordValid = await user.validPassword(password);
  if (!isPasswordValid) {
    console.error('Login Failed: Password mismatch');
    throw new Error('Invalid password');
  }

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '30d' });
  console.log('Login Success');
  return { user, token };
};

module.exports = { signup, verifyOtp, login };
