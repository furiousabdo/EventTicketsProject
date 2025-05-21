// controllers/authController.js
const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sendEmail = require('../Bonus(OTP)/sendEmail');
// Register a new user
exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
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
    if (user && await user.matchPassword(password)) {
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

// @desc    Reset password
// @route   PUT /api/v1/forgetPassword
// @access  Public
exports.forgetPassword = asyncHandler(async (req, res) => {
    const { email, newPassword } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }
    user.password = newPassword;
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
    if (name)  user.name = name;
    if (email) user.email = email;

    // Save updated user
    await user.save();

    // Send success response
    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
// BONUS PART RECALLED (OTP)
import sendEmail from "../Bonus(OTP)/sendEmail.js";
const otp = Math.floor(100000 + Math.random() * 900000).toString();
const otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes from now

// Step 2: Save OTP to user
user.otp = otp;
user.otpExpires = otpExpires;
await user.save();

// Step 3: Create email content
const message = `
  <h3>Password Reset OTP</h3>
  <p>Your OTP is: <strong>${otp}</strong></p>
  <p>It is valid for 10 minutes.</p>
`;

// Step 4: Send the actual OTP via email
await sendEmail(user.email, "Password Reset OTP", message);