const { User, UsageStats, Subscription } = require('../models');
const PendingUser = require('../models/PendingUser');
const Otp = require('../models/Otp');
const jwt = require('jsonwebtoken');
const { sendOTP } = require('../utils/email');
const bcrypt = require('bcryptjs');

const login = async (email, password, deviceId) => {
  const normalizedEmail = email.toLowerCase().trim();
  const user = await User.findOne({ where: { email: normalizedEmail } });
  
  if (!user) throw new Error('NOT_FOUND');
  
  // CHECK IF ACCOUNT IS ACTIVE/BLOCKED
  if (!user.is_active) {
    throw new Error('ACCOUNT_DISABLED: Your account has been disabled. Please contact support.');
  }
  
  const isPasswordValid = await user.validPassword(password);
  if (!isPasswordValid) throw new Error('INVALID_PASS');

  // DEVICE BINDING LOGIC
  if (deviceId !== 'ADMIN_WEB_PANEL') {
    if (!user.device_id) {
      await user.update({ device_id: deviceId });
    } else if (user.device_id !== deviceId) {
      throw new Error('DEVICE_MISMATCH: This account is already bound to another device.');
    }
  }

  // CHECK IF VOICE ENROLLMENT IS MISSING
  const needsEnrollment = !user.voice_signature;

  const token = jwt.sign(
    { id: user.id, role: user.role, needsVoiceEnrollment: needsEnrollment }, 
    process.env.JWT_SECRET, 
    { expiresIn: '30d' }
  );
  
  return { user, token, needsVoiceEnrollment: needsEnrollment };
};

const verifyOtp = async (email, code, deviceId) => {
  const normalizedEmail = email.toLowerCase().trim();
  const pending = await PendingUser.findOne({ where: { email: normalizedEmail, otp_code: code.trim() } });

  if (!pending) throw new Error('INVALID_CODE');
  if (new Date() > pending.expires_at) throw new Error('EXPIRED');

  const user = await User.create({
    email: pending.email,
    name: pending.name,
    password: pending.password, 
    device_id: deviceId,
    is_verified: true,
    role: 'user',
    created_at: new Date(),
    updated_at: new Date()
  }, { hooks: false });

  await UsageStats.create({ user_id: user.id, created_at: new Date(), updated_at: new Date() });
  
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + 30);
  
  await Subscription.create({
    user_id: user.id,
    plan_type: 'free',
    start_date: new Date(),
    end_date: endDate,
    status: 'active'
  });

  await pending.destroy({ hooks: false });

  return true;
};

const signup = async (userData) => {
  const { email, name, password } = userData;
  const normalizedEmail = email.toLowerCase().trim();

  try {
    const existingUser = await User.findOne({ where: { email: normalizedEmail } });
    if (existingUser) throw new Error('ALREADY_EXISTS');

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    await PendingUser.destroy({ where: { email: normalizedEmail }, hooks: false });
    await PendingUser.create({
      email: normalizedEmail,
      name,
      password, 
      otp_code: otpCode,
      expires_at: new Date(Date.now() + 600000)
    });

    await sendOTP(normalizedEmail, otpCode);
    return { email: normalizedEmail };
  } catch (error) {
    throw error;
  }
};

const generateResetToken = async (email) => {
  const normalizedEmail = email.toLowerCase().trim();
  const user = await User.findOne({ where: { email: normalizedEmail } });
  if (!user) throw new Error('USER_NOT_FOUND');

  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
  await Otp.destroy({ where: { email: normalizedEmail } });
  await Otp.create({
    email: normalizedEmail,
    code: otpCode,
    expires_at: new Date(Date.now() + 600000),
    created_at: new Date(),
    updated_at: new Date()
  });

  await sendOTP(normalizedEmail, `Your password reset code is: ${otpCode}`);
  return true;
};

const resetPassword = async (email, otp, newPassword) => {
  const normalizedEmail = email.toLowerCase().trim();
  const otpRecord = await Otp.findOne({
    where: { email: normalizedEmail, code: otp.trim() }
  });

  if (!otpRecord || new Date() > otpRecord.expires_at) {
    throw new Error('INVALID_OR_EXPIRED_OTP');
  }

  await User.update(
    { password: newPassword },
    { where: { email: normalizedEmail }, individualHooks: true }
  );

  await otpRecord.destroy();
  return true;
};

module.exports = { signup, verifyOtp, login, generateResetToken, resetPassword };
