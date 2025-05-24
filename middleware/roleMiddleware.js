// Admin role middleware
module.exports.isAdmin = (req, res, next) => {
    if (req.user && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Admin access required' });
    }
    next();
};

// Organizer role middleware
module.exports.isOrganizer = (req, res, next) => {
    if (req.user && req.user.role !== 'organizer') {
        return res.status(403).json({ message: 'Organizer access required' });
    }
    next();
};

// User role middleware - allows any authenticated user (user, organizer, or admin)
module.exports.isUser = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: 'Authentication required' });
    }
    next();
};