// utils/generateToken.js
const jwt = require('jsonwebtoken');

const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET || 'your-jwt-secret',
    { expiresIn: '30d' }
  );
};

module.exports = generateToken;
