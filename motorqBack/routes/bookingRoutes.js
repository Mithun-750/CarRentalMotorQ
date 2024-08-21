const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const authMiddleware = require('../middleware/authmiddleware');

router.post('/book', authMiddleware, bookingController.bookCar);
router.patch('/cancel/:id', authMiddleware, bookingController.cancelBooking);
router.get('/car/:carID', bookingController.getAllBookingsForCar);
router.get('/car/status/:carID', bookingController.getCurrentBookingStatus);
router.get('/customer/', authMiddleware, bookingController.getAllBookingsForCustomer);
router.get('/current', bookingController.getAllCurrentBookings);
router.get('/confirm/:id', bookingController.confirmCancellation);


module.exports = router;
