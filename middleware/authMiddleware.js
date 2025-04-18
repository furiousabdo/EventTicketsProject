// authMiddleware.js
const jwt = require('jsonwebtoken');

// Authenticate user
const authenticate = (req, res, next) => {
    const token = req.header('x-auth-token');
    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user;
        console.log("Authenticated User:", req.user); // Log authenticated user info
        next();
    } catch (err) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};

// Admin role middleware
const isAdmin = (req, res, next) => {
    console.log("User Role:", req.user ? req.user.role : "No user role"); // Log user role
    if (req.user && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Admin access required' });
    }
    next();
};

// Organizer role middleware
const isOrganizer = (req, res, next) => {
    console.log("User Role:", req.user ? req.user.role : "No user role"); // Log user role
    if (req.user && req.user.role !== 'organizer') {
        return res.status(403).json({ message: 'Organizer access required' });
    }
    next();
};

module.exports = { authenticate, isAdmin, isOrganizer };
