const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');

exports.signup = async (req, res) => {
    const { name, address, username, password } = req.body;
    try {
        const admin = new Admin({ name, address, username, password });
        await admin.save();
        res.json({ msg: 'Admin registered successfully' });
    } catch (err) {
        res.status(500).json({ msg: 'Server Error' });
    }
};

exports.login = async (req, res) => {
    const { username, password } = req.body;
    try {
        const admin = await Admin.findOne({ username });
        if (!admin) return res.status(400).json({ msg: 'Invalid credentials' });

        const isMatch = await admin.comparePassword(password);
        if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

        const token = jwt.sign({ id: admin._id }, 'your_jwt_secret', { expiresIn: '1h' });
        res.json({ token });
    } catch (err) {
        res.status(500).json({ msg: 'Server Error' });
    }
};
