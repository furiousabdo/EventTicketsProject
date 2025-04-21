const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register a new user
exports.register = async (req, res) => {
  const { name, email, password, role } = req.body;

  // Validate role, default to 'user' if invalid
  const userRole = role === 'admin' || role === 'organizer' ? role : 'user';

  try {
      // Check if email already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
          return res.status(400).json({ message: 'Email is already registered' });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = new User({
          name,
          email,
          password: hashedPassword,
          role: userRole,
      });

      await newUser.save();
      res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
  }
};

// User login
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
      const user = await User.findOne({ email });
      if (!user) {
          return res.status(400).json({ message: 'Invalid credentials (user not found)' });
      }

      console.log("Entered Password:", password);
      console.log("Stored Hashed Password:", user.password);

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
          return res.status(400).json({ message: 'Invalid credentials (wrong password)' });
      }

      const payload = {
          user: {
              id: user._id,
              role: user.role,
          },
      };

      const token = jwt.sign(payload, 'yourSecretKey', { expiresIn: '1h' });
      res.status(200).json({ token });
  } catch (err) {
      console.error(err);
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
