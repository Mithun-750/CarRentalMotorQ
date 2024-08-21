const Customer = require('../models/Customer');
const jwt = require('jsonwebtoken');

exports.signup = async (req, res) => {
    const { name, email, dlImage, price, duration, username, password } = req.body;
    try {
        const customer = new Customer({ name, email, dlImage, price, duration, username, password });
        await customer.save();
        res.json({ msg: 'Customer registered successfully' });
    } catch (err) {
        res.status(500).json({ msg: 'Server Error', error: err.message });
        console.log(err)
    }
};

exports.login = async (req, res) => {
    const { username, password } = req.body;
    try {
        const customer = await Customer.findOne({ username });
        if (!customer) return res.status(400).json({ msg: 'Invalid credentials' });

        const isMatch = await customer.comparePassword(password);
        if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

        const token = jwt.sign({ id: customer._id }, 'your_jwt_secret', { expiresIn: '1h' });
        res.json({ token });
    } catch (err) {
        res.status(500).json({ msg: 'Server Error', error: err.message });
    }
};
