const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        mongoose.connect('mongodb://localhost:27017/carental');
        console.log('MongoDB connected');
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};

module.exports = connectDB;
