const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const Customer = require('../models/Customer');

const authMiddleware = async (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });
    
    try {
        const decoded = await jwt.verify(token, 'your_jwt_secret');
        const user = await Admin.findById(decoded.id) || await Customer.findById(decoded.id);
        
        if (!user) return res.status(401).json({ msg: 'User not found' });

        req.user = user;
        req.isAdmin = !!await Admin.findById(decoded.id); // Boolean to check if user is an admin
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
};

module.exports = authMiddleware;
