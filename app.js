const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');

dotenv.config(); // Load environment variables from .env
console.log(process.env.MONGO_URI);  // Should log 'mongodb://127.0.0.1:27017/eventticketsdb'
console.log(process.env.JWT_SECRET);  // Should log 'supersecretkey'

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Parse JSON bodies

// Routes
app.use('/api/v1', authRoutes); // Mount auth routes at /api/v1
app.use('/api/v1/users', userRoutes); // Mount user routes at /api/v1/users

// Connect to MongoDB
// mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
//  .then(() => console.log('Connected to MongoDB'))
//  .catch((error) => console.error('Error connecting to MongoDB:', error));

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
