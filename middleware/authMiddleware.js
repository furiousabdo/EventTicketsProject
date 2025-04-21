// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');

exports.protect = asyncHandler(async (req, res, next) => {
    let token = req.headers.authorization?.startsWith('Bearer')
        ? req.headers.authorization.split(' ')[1]
        : null;
    if (!token) {
        res.status(401);
        throw new Error('Not authorized, no token');
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select('-password');
        next();
    } catch (err) {
        res.status(401);
        throw new Error('Not authorized, token failed');
    }
});

exports.allowRoles = (...roles) => (req, res, next) => {
    if (!roles.includes(req.user.role)) {
        res.status(403);
        throw new Error(`Role ${req.user.role} not authorized`);
    }
    next();
};

// aliases so your routes can still import `authenticate` and `authorizeRoles`
exports.authenticate = exports.protect;
exports.authorizeRoles = exports.allowRoles;
