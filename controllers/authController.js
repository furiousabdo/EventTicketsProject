// controllers/authController.js
const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// @desc    Register new user
// @route   POST /api/v1/register
// @access  Public
exports.register = asyncHandler(async (req, res) => {
    const { name, email, password, role } = req.body;
    if (await User.findOne({ email })) {
        res.status(400);
        throw new Error('User already exists');
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
