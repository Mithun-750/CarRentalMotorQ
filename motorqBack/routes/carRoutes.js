const express = require('express');
const router = express.Router();
const carController = require('../controllers/carController');
const authMiddleware = require('../middleware/authmiddleware');

router.get('/car/:id', carController.getCarById);

// Get All Cars
router.get('/', carController.getAllCars);

// Add a New Car (Protected Route - Admin Only)
router.post('/add', authMiddleware, carController.addCar);

// Delete a Car by ID (Protected Route - Admin Only)
router.delete('/:id', authMiddleware, carController.deleteCar);

// Update a Car by ID (Protected Route - Admin Only)
router.put('/:id', authMiddleware, carController.updateCar);

router.get('/reviews/:id', carController.getCarReviews);

module.exports = router;
