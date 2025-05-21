const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sendEmail = require('../Bonus(OTP)/sendEmail');

// Utility: Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Register a new user
// @route   POST /api/v1/register
// @access  Public
exports.register = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  // Check if the user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const user = await User.create({ name, email, password, role });

  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    token: generateToken(user._id),
  });
});

// @desc    Authenticate user & get token
// @route   POST /api/v1/login
// @access  Public
exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (user && (await user.matchPassword(password))) {
    return res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  }

  res.status(401);
  throw new Error('Invalid email or password');
});

// @desc    Reset password using OTP
// @route   PUT /api/v1/forgetPassword
// @access  Public
exports.forgetPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpires = Date.now() + 10 * 60 * 1000;

  user.otp = otp;
  user.otpExpires = otpExpires;
  await user.save();

  const message = `
    <h3>Password Reset OTP</h3>
    <p>Your OTP is: <strong>${otp}</strong></p>
    <p>It is valid for 10 minutes.</p>
  `;

  await sendEmail(user.email, 'Password Reset OTP', message);

  res.json({ message: 'OTP sent to email' });
});

// @desc    Verify OTP and reset password
// @route   POST /api/v1/resetPassword
// @access  Public
exports.resetPassword = asyncHandler(async (req, res) => {
  const { email, otp, newPassword } = req.body;
  const user = await User.findOne({ email });

  if (!user || user.otp !== otp || user.otpExpires < Date.now()) {
    res.status(400);
    throw new Error('Invalid or expired OTP');
  }

  user.password = newPassword;
  user.otp = undefined;
  user.otpExpires = undefined;
  await user.save();

  res.json({ message: 'Password updated successfully' });
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

  if (name) user.name = name;
  if (email) user.email = email;
  if (password) user.password = password;

  await user.save();

  res.json({ message: 'Profile updated successfully' });
});
