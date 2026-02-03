const nodemailer = require('nodemailer');
require('dotenv').config();

// ENABLE POOLING FOR INSTANT DISPATCH
const transporter = nodemailer.createTransport({
  pool: true, // Key fix: keeps the connection open
  maxConnections: 5,
  maxMessages: 100,
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false, // STARTTLS
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false
  }
});

const sendOTP = async (email, otp) => {
  const sender = process.env.SENDER_EMAIL || process.env.EMAIL_USER;
  
  const mailOptions = {
    from: {
        name: "APPLE AI Assistant",
        address: sender
    },
    to: email,
    subject: `${otp} is your verification code`,
    text: `Your 6-digit access code is: ${otp}`,
    html: `
      <div style="font-family: sans-serif; max-width: 400px; margin: 20px auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
        <h2 style="color: #333; text-align: center;">Security Verification</h2>
        <p style="font-size: 16px; color: #555;">Use the code below to access your account:</p>
        <div style="background: #f4f4f4; padding: 15px; text-align: center; font-size: 36px; font-weight: bold; letter-spacing: 5px; color: #007bff; margin: 20px 0;">
          ${otp}
        </div>
        <p style="color: #888; font-size: 12px; text-align: center;">Code expires in 10 minutes. Protocol: <b>STRICT-AI-SECURE</b></p>
      </div>
    `,
  };

  try {
    // Non-blocking dispatch
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('--- DISPATCH FAILED ---', error.message);
      } else {
        console.log('--- OTP DISPATCHED INSTANTLY ---', info.messageId);
      }
    });
  } catch (error) {
    console.error('--- CRITICAL SMTP FAULT ---', error.message);
  }
};

module.exports = { sendOTP };
