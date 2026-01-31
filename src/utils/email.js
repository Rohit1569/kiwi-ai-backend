const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || "smtp-relay.brevo.com",
  port: 587,
  secure: false, 
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
    subject: `${otp} is your APPLE AI code`, // Putting OTP in subject helps delivery
    html: `
      <div style="font-family: sans-serif; padding: 20px; color: #333;">
        <h2>Verify your account</h2>
        <p>Your verification code is:</p>
        <div style="font-size: 32px; font-weight: bold; color: #3498db; padding: 10px; background: #f4f4f4; display: inline-block;">
          ${otp}
        </div>
        <p>This code expires in 10 minutes.</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`--- TRANSMITTED TO: ${email} ---`);
  } catch (error) {
    console.error('--- SMTP ERROR ---');
    console.error(error.message);
    throw error;
  }
};

module.exports = { sendOTP };
