const mongoose = require('mongoose');
require('dotenv').config();

const testConnection = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('✅ MongoDB connection successful!');
        mongoose.connection.close();
    } catch (error) {
        console.error('❌ MongoDB connection failed:', error.message);
    }
};

testConnection();
