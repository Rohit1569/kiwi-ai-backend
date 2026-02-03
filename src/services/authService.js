const User = require('../models/User');
const UsageStats = require('../models/UsageStats');
const PendingUser = require('../models/PendingUser');
const jwt = require('jsonwebtoken');
const { sendOTP } = require('../utils/email');

const signup = async (userData) => {
  console.log('--- SIGNUP SERVICE START ---');
  const { email, name, password } = userData;
  const normalizedEmail = email.toLowerCase().trim();

  try {
    const existingUser = await User.findOne({ where: { email: normalizedEmail } });
    if (existingUser) throw new Error('ALREADY_EXISTS');

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    await PendingUser.destroy({ 
      where: { email: normalizedEmail },
      hooks: false
    }); 
    
    await PendingUser.create({
      email: normalizedEmail,
      name,
      password, 
      otp_code: otpCode,
      expires_at: new Date(Date.now() + 600000),
      created_at: new Date(),
      updated_at: new Date()
    });

    console.log('DB Prep Complete. Initiating Blocking Mail Dispatch...');

    // CRITICAL: We await here because Vercel will kill the process if we don't.
    await sendOTP(normalizedEmail, otpCode);

    return { email: normalizedEmail };
  } catch (error) {
    console.error('SIGNUP ERROR:', error.message);
    throw error;
  }
};

const verifyOtp = async (email, code) => {
  const normalizedEmail = email.toLowerCase().trim();
  
  try {
    const pending = await PendingUser.findOne({ 
      where: { email: normalizedEmail, otp_code: code.trim() }
    });

    if (!pending) throw new Error('INVALID_CODE');
    if (new Date() > pending.expires_at) throw new Error('EXPIRED');

    const user = await User.create({
      email: pending.email,
      name: pending.name,
      password: pending.password, 
      is_verified: true,
      created_at: new Date(),
      updated_at: new Date()
    }, { hooks: false });

    await UsageStats.create({ 
      user_id: user.id,
      created_at: new Date(),
      updated_at: new Date()
    });
    
    await pending.destroy({ hooks: false });

    return true;
  } catch (error) {
    console.error('VERIFY ERROR:', error.message);
    throw error;
  }
};

const login = async (email, password) => {
  const normalizedEmail = email.toLowerCase().trim();
  const user = await User.findOne({ where: { email: normalizedEmail } });
  if (!user) throw new Error('NOT_FOUND');
  
  const isPasswordValid = await user.validPassword(password);
  if (!isPasswordValid) throw new Error('INVALID_PASS');

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '30d' });
  return { user, token };
};

module.exports = { signup, verifyOtp, login };
