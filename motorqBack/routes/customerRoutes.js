const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');
const authMiddleware = require('../middleware/authmiddleware');

// Signup and Login routes
router.post('/signup', customerController.signup);
router.post('/login', customerController.login);


module.exports = router;
