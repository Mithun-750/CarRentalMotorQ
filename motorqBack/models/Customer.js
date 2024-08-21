const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const CustomerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true }, // Updated field
    dlImage: { type: String }, // URL or path to the image
    price: { type: Number },
    duration: { type: Number },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

CustomerSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

CustomerSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('Customer', CustomerSchema);
