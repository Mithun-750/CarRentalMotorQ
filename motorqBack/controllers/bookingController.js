const nodemailer = require('nodemailer');
const Booking = require('../models/Booking');
const Car = require('../models/Car');

// Set up nodemailer transporter
const transporter = nodemailer.createTransport({
    service: 'gmail', // You can change this to your preferred email service provider
    auth: {
        user: 'hive0024@gmail.com', // Your email
        pass: 'oygj wgsp adob wsrw' // Your email password or app-specific password
    }
});

// Book a Car
exports.bookCar = async (req, res) => {
    const { carID, startDateTime, endDateTime, rating, feedback } = req.body;
    const { user, isAdmin } = req; 

    if (isAdmin) {
        return res.status(403).json({ msg: 'Admins cannot book cars' });
    }

    try {
        const car = await Car.findById(carID);
        if (!car) return res.status(404).json({ msg: 'Car not found' });

        const newBooking = new Booking({ carID, customerID: user._id, startDateTime, endDateTime, rating, feedback });
        await newBooking.save();

        await car.save();

        // Send an email to the customer
        const mailOptions = {
            from: 'hive0024@gmail.com',
            to: user.email, 
            subject: 'Booking Confirmation',
            text: `Dear ${user.name},\n\nYour booking for the car ${car.name} has been confirmed.\n\nBooking Details:\nStart: ${startDateTime}\nEnd: ${endDateTime}\n\nThank you for choosing our service.\n\nBest regards,\nCar Rental Service`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log('Error sending email:', error);
            } else {
                console.log('Email sent:', info.response);
            }
        });

        res.json(newBooking);
    } catch (err) {
        res.status(500).json({ msg: 'Server Error' });
    }
};


// Cancel a Booking
// Cancel a Booking
exports.cancelBooking = async (req, res) => {
    const { id } = req.params;
    const { feedback, rating } = req.body;

    try {
        const booking = await Booking.findById(id).populate('carID');
        if (!booking) return res.status(404).json({ msg: 'Booking not found' });

        // Check if the user is the one who made the booking or is an admin
        if (booking.customerID.toString() !== req.user._id.toString() && !req.isAdmin) {
            return res.status(403).json({ msg: 'Unauthorized' });
        }

        // Optionally update feedback and rating if provided
        if (feedback) {
            booking.feedback = feedback;
        }
        if (rating) {
            booking.rating = rating;
        }

        booking.status = 'Cancelled';
        await booking.save();

        // Generate a confirmation link
        const confirmLink = `http://localhost:5000/api/booking/confirm/${booking._id}`;

        // Send confirmation email to the user with the confirmation link
        const userMailOptions = {
            from: 'hive0024@gmail.com',
            to: req.user.email, 
            subject: 'Booking Cancellation Confirmation',
            text: `Dear ${req.user.name},\n\nYour booking for the car ${booking.carID.name} has been successfully cancelled.\n\nPlease confirm your cancellation by clicking the following link: ${confirmLink}\n\nWe hope to see you again soon.\n\nBest regards,\nCar Rental Service`
        };

        transporter.sendMail(userMailOptions, (error, info) => {
            if (error) {
                console.log('Error sending email to user:', error);
            } else {
                console.log('Cancellation email with confirmation link sent to user:', info.response);
            }
        });

        res.json({ msg: 'Booking cancelled successfully. Confirmation email sent.', booking });
    } catch (err) {
        console.log(err); // Log error for debugging
        res.status(500).json({ msg: 'Server Error' });
    }
};


// Confirm booking cancellation
exports.confirmCancellation = async (req, res) => {
    const { id } = req.params;

    try {
        const booking = await Booking.findById(id);
        if (!booking) return res.status(404).json({ msg: 'Booking not found' });

        if (booking.status !== 'Cancelled') {
            return res.status(400).json({ msg: 'Booking has not been cancelled yet' });
        }

        // Mark the booking as confirmed by user
        booking.confirmedCancellation = true;
        await booking.save();

        res.json({ msg: 'Cancellation confirmed successfully!' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ msg: 'Server Error' });
    }
};



// Get All Bookings for a Car (including past bookings)
exports.getAllBookingsForCar = async (req, res) => {
    const { carID } = req.params;

    try {
        const bookings = await Booking.find({ carID });
        res.json(bookings);
    } catch (err) {
        res.status(500).json({ msg: 'Server Error' });
    }
};

// Get Current Booking Status for a Car
exports.getCurrentBookingStatus = async (req, res) => {
    const { carID } = req.params;
    const now = new Date();

    try {
        const currentBooking = await Booking.findOne({
            carID,
            status: 'Booked',
            startDateTime: { $lte: now },
            endDateTime: { $gte: now }
        });

        if (currentBooking) {
            res.json({ status: 'Booked', booking: currentBooking });
        } else {
            res.json({ status: 'Available' });
        }
    } catch (err) {
        res.status(500).json({ msg: 'Server Error' });
    }
};

// Get All Bookings for a Customer
exports.getAllBookingsForCustomer = async (req, res) => {
    try {
        const bookings = await Booking.find({ customerID: req.user._id })
            .populate('carID')
            .exec();
        res.json(bookings);
    } catch (err) {
        console.log(err);
        res.status(500).json({ msg: 'Server Error' });
    }
};

// Get All Current Bookings
exports.getAllCurrentBookings = async (req, res) => {
    const now = new Date();

    try {
        const currentBookings = await Booking.find({
            status: 'Booked'
        })
        .populate('carID')
        .populate('customerID', 'name email') 
        .exec();
        
        res.json(currentBookings);
    } catch (err) {
        res.status(500).json({ msg: 'Server Error' });
    }
};

