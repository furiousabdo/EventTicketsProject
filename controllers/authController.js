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

    // Create a new user
    const user = new User({ name, email, password });
    await user.save();

    // Send success response
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// User login
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Compare password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = user.generateToken();

    // Send token as response
    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get current user's profile
exports.getProfile = async (req, res) => {
  try {
    // Find user by ID (from JWT)
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Send user profile data
    res.json({ name: user.name, email: user.email, role: user.role });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update current user's profile
exports.updateProfile = async (req, res) => {
  const { name, email } = req.body;

  try {
    // Find user by ID (from JWT)
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update user fields
    if (name) user.name = name;
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