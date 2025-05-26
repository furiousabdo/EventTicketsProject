const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

// @desc    Register a new user
// @route   POST /api/v1/auth/register
// @access  Public
exports.register = asyncHandler(async (req, res) => {
  const { name, email, password, role, organizerKey } = req.body;

  // Check if the user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    res.status(400);
    throw new Error('User already exists');
  }

  // Verify organizer key if registering as organizer
  if (role === 'organizer') {
    if (!organizerKey) {
      res.status(400);
      throw new Error('Organizer key is required for organizer registration');
    }
    
    const isValidKey = User.verifyOrganizerKey(organizerKey);
    if (!isValidKey) {
      res.status(400);
      throw new Error('Invalid organizer key');
    }
  }

  // Create user with default role if not specified
  const user = await User.create({
    name,
    email,
    password,
    role: role || 'user'
  });

  // Send response with user data and token
  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    token: generateToken(user._id)
  });
});

// @desc    Authenticate user & get token
// @route   POST /api/v1/auth/login
// @access  Public
exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Find user by email and explicitly select password field
  const user = await User.findOne({ email }).select('+password +mfaSecret');

  if (!user) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  // Check if MFA is enabled
  if (user.mfaEnabled) {
    // Generate temporary token for MFA verification
    const tempToken = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || 'your-jwt-secret',
      { expiresIn: '5m' }
    );

    return res.json({
      requiresMFA: true,
      tempToken
    });
  }

  // Regular login without MFA
  const token = generateToken(user._id);
  res.json({
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
});

// @desc    Reset password using OTP
// @route   POST /api/v1/auth/forgot-password
// @access  Public
exports.forgetPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  // Log the attempt with timestamp
  console.log(`\n[${new Date().toISOString()}] Password reset attempt`);
  console.log('Email:', email);

  const user = await User.findOne({ email });
  if (!user) {
    console.log('❌ User not found with email:', email);
    res.status(404);
    throw new Error('User not found');
  }

  // Generate 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

  // Save OTP to user
  user.otp = otp;
  user.otpExpires = otpExpires;
  await user.save();

  // Detailed environment variable check
  console.log('\nEmail Configuration Check:');
  console.log('EMAIL_USER:', process.env.EMAIL_USER ? '✓ Present' : '❌ Missing');
  console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? '✓ Present' : '❌ Missing');

  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error('❌ Missing email configuration in .env file');
    res.status(500);
    throw new Error('Email configuration missing. Check server .env file for EMAIL_USER and EMAIL_PASS');
  }

  // Create transporter with detailed error handling
  let transporter;
  try {
    console.log('\nAttempting to create email transporter...');
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    // Verify transporter
    console.log('Verifying SMTP connection...');
    await transporter.verify();
    console.log('✓ SMTP connection verified successfully');
  } catch (error) {
    console.error('\n❌ Transporter Error Details:');
    console.error('Error Name:', error.name);
    console.error('Error Message:', error.message);
    if (error.code) console.error('Error Code:', error.code);
    if (error.command) console.error('SMTP Command:', error.command);
    
    // Clean up OTP
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();
    
    res.status(500);
    throw new Error(`Email service error: ${error.message}. Please check email configuration and credentials.`);
  }

  const message = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #6a1b9a; text-align: center;">Password Reset OTP</h1>
      <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px;">
        <p>Your OTP for password reset is: <strong style="color: #9c27b0; font-size: 24px;">${otp}</strong></p>
        <p>This OTP will expire in 10 minutes.</p>
        <p style="color: #666;">If you did not request this, please ignore this email.</p>
      </div>
    </div>
  `;

  try {
    console.log('\nAttempting to send email...');
    const mailOptions = {
      from: `"NovaSync Events" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Password Reset OTP',
      html: message
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✓ Email sent successfully');
    console.log('Message ID:', info.messageId);
    console.log('Response:', info.response);

    res.status(200).json({ 
      message: 'OTP sent to your email',
      email: email
    });
  } catch (error) {
    console.error('\n❌ Email Sending Error Details:');
    console.error('Error Name:', error.name);
    console.error('Error Message:', error.message);
    if (error.code) console.error('Error Code:', error.code);
    if (error.command) console.error('SMTP Command:', error.command);
    
    // Clean up OTP if email fails
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();
    
    res.status(500);
    throw new Error(`Failed to send OTP email: ${error.message}. Please check server logs for details.`);
  }
});

// @desc    Verify OTP and reset password
// @route   POST /api/v1/resetPassword
// @access  Public
exports.resetPassword = asyncHandler(async (req, res) => {
  const { email, otp, newPassword } = req.body;
  
  const user = await User.findOne({ 
    email,
    otp,
    otpExpires: { $gt: Date.now() }
  });

  if (!user) {
    res.status(400);
    throw new Error('Invalid or expired OTP');
  }

  // Update password and clear OTP
  user.password = newPassword;
  user.otp = undefined;
  user.otpExpires = undefined;
  await user.save();

  res.status(200).json({ message: 'Password reset successful' });
});

// @desc    Get logged in user profile
// @route   GET /api/v1/profile
// @access  Private
exports.getProfile = asyncHandler(async (req, res) => {
  res.json(req.user);
});

// @desc    Update logged in user profile
// @route   PUT /api/v1/profile
// @access  Private
exports.updateProfile = asyncHandler(async (req, res) => {
    const user = req.user;
    const { name, email, password } = req.body;
    if (name)  user.name = name;
    if (email) user.email = email;
    if (password) user.password = password;  // will be hashed by pre-save hook
    const updated = await user.save();
    res.json({
        _id: updated._id,
        name: updated.name,
        email: updated.email,
        role: updated.role,
        token: generateToken(updated._id),
    });
});

// @desc    Setup MFA
// @route   POST /api/auth/mfa/setup
// @access  Private
exports.setupMFA = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    
    // Generate secret
    const secret = speakeasy.generateSecret({
        name: `EventTicketing:${user.email}`
    });

    // Save temporary secret
    user.mfaTempSecret = secret.base32;
    await user.save();

    // Generate QR code
    const qrCode = await QRCode.toDataURL(secret.otpauth_url);

    res.json({
        secret: secret.base32,
        qrCode
    });
});

// @desc    Verify MFA setup
// @route   POST /api/auth/mfa/verify
// @access  Private
exports.verifyMFA = asyncHandler(async (req, res) => {
    const { code } = req.body;
    const user = await User.findById(req.user._id).select('+mfaTempSecret');

    if (!user.mfaTempSecret) {
        res.status(400);
        throw new Error('MFA setup not initiated');
    }

    const verified = speakeasy.totp.verify({
        secret: user.mfaTempSecret,
        encoding: 'base32',
        token: code
    });

    if (!verified) {
        res.status(400);
        throw new Error('Invalid verification code');
    }

    // Enable MFA and save permanent secret
    user.mfaEnabled = true;
    user.mfaSecret = user.mfaTempSecret;
    user.mfaTempSecret = undefined;
    await user.save();

    res.json({ message: 'MFA enabled successfully' });
});

// @desc    Verify MFA during login
// @route   POST /api/auth/mfa/verify-login
// @access  Public
exports.verifyMFALogin = asyncHandler(async (req, res) => {
    const { code, tempToken } = req.body;

    // Verify temp token and get user
    const decoded = jwt.verify(tempToken, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('+mfaSecret');

    if (!user.mfaEnabled || !user.mfaSecret) {
        res.status(400);
        throw new Error('MFA not enabled for this user');
    }

    const verified = speakeasy.totp.verify({
        secret: user.mfaSecret,
        encoding: 'base32',
        token: code
    });

    if (!verified) {
        res.status(400);
        throw new Error('Invalid verification code');
    }

    // Generate permanent token
    const token = generateToken(user._id);

    res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token
    });
});

// @desc    Disable MFA
// @route   POST /api/auth/mfa/disable
// @access  Private
exports.disableMFA = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    
    user.mfaEnabled = false;
    user.mfaSecret = undefined;
    await user.save();

    res.json({ message: 'MFA disabled successfully' });
});
