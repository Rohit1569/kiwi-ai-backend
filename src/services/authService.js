const User = require('../models/User');
const UsageStats = require('../models/UsageStats');
const PendingUser = require('../models/PendingUser');
const jwt = require('jsonwebtoken');
const { sendOTP } = require('../utils/email');

const signup = async (userData) => {
  console.log('--- SIGNUP SERVICE START ---');
  const { email, name, password } = userData;
  
  if (!email || !name || !password) {
    console.error('SIGNUP ERROR: Missing required fields');
    throw new Error('Email, Name, and Password are required');
  }

  const normalizedEmail = email.toLowerCase().trim();
  console.log('Normalized Email:', normalizedEmail);

  try {
    console.log('Checking for existing user...');
    const existingUser = await User.findOne({ where: { email: normalizedEmail } });
    if (existingUser) {
      console.warn('SIGNUP ERROR: User already exists');
      throw new Error('User already exists');
    }

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    console.log('Generated OTP:', otpCode);

    console.log('Cleaning up old pending attempts...');
    await PendingUser.destroy({ where: { email: normalizedEmail } }); 
    
    console.log('Creating pending user record...');
    const pending = await PendingUser.create({
      email: normalizedEmail,
      name,
      password, 
      otp_code: otpCode,
      expires_at: new Date(Date.now() + 600000)
    });
    console.log('Pending user record created with ID:', pending.id);

    console.log(`--- OTP GENERATED: ${otpCode} for ${normalizedEmail} ---`);
    try {
      console.log('Sending OTP via email service...');
      await sendOTP(normalizedEmail, otpCode);
      console.log('Email sent successfully');
    } catch (err) {
      console.error('Mail system error:', err.message);
      // We still throw here because if the email fails, the user can't verify.
      throw new Error(`Verification email failed: ${err.message}`);
    }

    console.log('--- SIGNUP SERVICE COMPLETE ---');
    return { email: normalizedEmail };
  } catch (dbError) {
    console.error('SIGNUP SERVICE DB/LOGIC ERROR:', dbError);
    throw dbError;
  }
};

const verifyOtp = async (email, code) => {
  const normalizedEmail = email.toLowerCase().trim();
  console.log(`--- VERIFYING OTP: ${code} for ${normalizedEmail} ---`);
  
  try {
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

    console.log('Moving pending user to permanent storage...');
    const user = await User.create({
      email: pending.email,
      name: pending.name,
      password: pending.password, 
      is_verified: true
    }, { hooks: false });

    console.log('Initializing usage stats...');
    await UsageStats.create({ user_id: user.id });
    
    console.log('Deleting pending record...');
    await pending.destroy();

    console.log(`--- VERIFICATION SUCCESS: ${normalizedEmail} verified ---`);
    return true;
  } catch (error) {
    console.error('VERIFY OTP SERVICE ERROR:', error);
    throw error;
  }
};

const login = async (email, password) => {
  const normalizedEmail = email.toLowerCase().trim();
  console.log(`--- LOGIN ATTEMPT: ${normalizedEmail} ---`);
  
  try {
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
  } catch (error) {
    console.error('LOGIN SERVICE ERROR:', error);
    throw error;
  }
};

module.exports = { signup, verifyOtp, login };
