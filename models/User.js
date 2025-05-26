// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    },
    email: { 
        type: String, 
        required: true, 
        unique: true,
        lowercase: true,
        trim: true
    },
    password: { 
        type: String, 
        required: true,
        select: false // Don't include password by default in queries
    },
    role: {
        type: String,
        enum: ['user', 'organizer', 'admin'],
        default: 'user'
    },
    otp: {
        type: String,
        select: false
    },
    otpExpires: {
        type: Date,
        select: false
    },
    mfaEnabled: {
        type: Boolean,
        default: false
    },
    mfaSecret: {
        type: String,
        select: false
    },
    mfaTempSecret: {
        type: String,
        select: false
    }
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Match password method
userSchema.methods.matchPassword = async function(enteredPassword) {
    try {
        return await bcrypt.compare(enteredPassword, this.password);
    } catch (error) {
        throw new Error('Error comparing passwords');
    }
};

// Static method to verify organizer key
userSchema.statics.verifyOrganizerKey = function(key) {
    const organizerKey = process.env.ORGANIZER_KEY;
    if (!organizerKey) {
        throw new Error('Organizer key not configured');
    }
    return key === organizerKey;
};

module.exports = mongoose.model('User', userSchema);
