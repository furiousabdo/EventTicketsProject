// controllers/authController.js
const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');
const jwt = require('jsonwebtoken');

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
    const user = await User.findOne({ email }).select('+mfaSecret');

    if (user && await user.matchPassword(password)) {
        if (user.mfaEnabled) {
            // Generate temporary token for MFA verification
            const tempToken = jwt.sign(
                { id: user._id },
                process.env.JWT_SECRET,
                { expiresIn: '5m' }
            );

            return res.json({
                requiresMFA: true,
                tempToken
            });
        }

        // Regular login without MFA
        return res.json({
            token: generateToken(user._id),
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
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
