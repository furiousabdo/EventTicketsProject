require('dotenv').config();
const nodemailer = require('nodemailer');
const User = require('../models/User');

module.exports = async (req, res) => {
  const { email } = req.body;
  let user;
  
  try {
    // Debug: Print environment variables
    console.log('================== DEBUG INFO ==================');
    console.log('EMAIL_USER exists:', !!process.env.EMAIL_USER);
    console.log('EMAIL_PASS exists:', !!process.env.EMAIL_PASS);
    console.log('EMAIL_USER:', process.env.EMAIL_USER);
    console.log('===============================================');

    user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

    // Save OTP to user
    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.error('Missing email configuration');
      return res.status(500).json({ 
        message: 'Email configuration missing. Check .env file.' 
      });
    }

    // Create transporter with more secure configuration
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      },
      debug: true
    });

    try {
      console.log('Verifying email configuration...');
      await transporter.verify();
      console.log('Email configuration verified successfully!');
    } catch (verifyError) {
      console.error('Email verification error details:', verifyError);
      throw new Error(`Email verification failed: ${verifyError.message}`);
    }

    const mailOptions = {
      from: `"Event Ticketing" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Password Reset OTP',
      html: `
        <h1>Password Reset OTP</h1>
        <p>Your OTP for password reset is: <strong>${otp}</strong></p>
        <p>This OTP will expire in 10 minutes.</p>
        <p>If you didn't request this, please ignore this email.</p>
      `
    };

    try {
      const info = await transporter.sendMail(mailOptions);
      console.log('Email sent successfully:', info.response);
      res.status(200).json({ 
        message: 'OTP sent to your email',
        email: email // Send back email for the frontend
      });
    } catch (emailError) {
      console.error('Email sending error details:', emailError);
      throw new Error(`Failed to send email: ${emailError.message}`);
    }
  } catch (err) {
    console.error('Final error:', err.message);
    if (user) {
      user.otp = undefined;
      user.otpExpires = undefined;
      await user.save();
    }
    res.status(500).json({ 
      message: err.message || 'An error occurred during password reset.' 
    });
  }
}; 