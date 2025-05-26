const nodemailer = require('nodemailer');

// Create reusable transporter
const createTransporter = () => {
    // Check for required environment variables
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.error('Missing required environment variables: EMAIL_USER and/or EMAIL_PASS');
        throw new Error('Email configuration is incomplete. Please check your .env file.');
    }

    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });
};

// Test email configuration
const verifyEmailConfig = async () => {
    try {
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            throw new Error('Missing required environment variables');
        }
        const transporter = createTransporter();
        await transporter.verify();
        console.log('Email configuration is valid');
        console.log('Using email account:', process.env.EMAIL_USER);
        return true;
    } catch (error) {
        console.error('Email configuration error:', error.message);
        return false;
    }
};

module.exports = {
    createTransporter,
    verifyEmailConfig
}; 