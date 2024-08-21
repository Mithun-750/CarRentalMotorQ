const Booking = require('../models/Booking');
const Car = require('../models/Car');

exports.getCarById = async (req, res) => {
    const { id } = req.params;

    try {
        const car = await Car.findById(id);
        if (!car) {
            return res.status(404).json({ msg: 'Car not found' });
        }
        res.json(car);
    } catch (err) {
        res.status(500).json({ msg: 'Server Error' });
    }
};

// Get All Cars
exports.getAllCars = async (req, res) => {
    try {
        const cars = await Car.find();
        res.json(cars);
    } catch (err) {
        res.status(500).json({ msg: 'Server Error' });
    }
};

// Add a New Car
exports.addCar = async (req, res) => {
    if (!req.isAdmin) {
        return res.status(403).json({ msg: 'Access denied. Admins only.' });
    }

    const { make, model, year, regNo, rate, location } = req.body;
    try {
        const newCar = new Car({ make, model, year, regNo, rate, location });
        await newCar.save();
        res.json(newCar);
    } catch (err) {
        res.status(500).json({ msg: 'Server Error' });
    }
};

// Delete a Car
exports.deleteCar = async (req, res) => {
    if (!req.isAdmin) {
        return res.status(403).json({ msg: 'Access denied. Admins only.' });
    }

    try {
        const car = await Car.findById(req.params.id);

        if (!car) {
            return res.status(404).json({ msg: 'Car not found' });
        }

        await Car.findByIdAndDelete(req.params.id); // Use findByIdAndDelete to remove the car
        res.json({ msg: 'Car deleted successfully' });
    } catch (err) {
        res.status(500).json({ msg: 'Server Error' });
    }
};

// Update a Car
exports.updateCar = async (req, res) => {
    if (!req.isAdmin) {
        return res.status(403).json({ msg: 'Access denied. Admins only.' });
    }

    const { id } = req.params;
    const { make, model, year, regNo, rate, location } = req.body;
    try {
        let car = await Car.findById(id);
        if (!car) {
            return res.status(404).json({ msg: 'Car not found' });
        }

        // Update the car's details
        car.make = make || car.make;
        car.model = model || car.model;
        car.year = year || car.year;
        car.regNo = regNo || car.regNo;
        car.rate = rate || car.rate;
        car.location = location || car.location;

        await car.save();
        res.json(car);
    } catch (err) {
        res.status(500).json({ msg: 'Server Error' });
    }
};

exports.getCarReviews = async (req, res) => {
    try {
        const carId = req.params.id;  // Get carId from request parameters
        
        // Find the car by ID
        const car = await Car.findById(carId);
        if (!car) {
            console.log(carId)
            return res.status(404).json({ message: 'Car not found' });
        }
        
        // Fetch bookings related to the car
        const bookings = await Booking.find({ carID: carId }).populate('customerID', 'name'); 

        // Process bookings to extract review details
        const reviews = bookings.map(booking => {
            return {
                reviewerName: booking.customerID.name,
                rating: booking.rating,
                feedback: booking.feedback,
                reviewDate: booking.endDateTime.toLocaleString('default', { month: 'long', year: 'numeric' })
            };
        });

        res.status(200).json(reviews);
    } catch (error) {
        console.error('Error fetching car reviews:', error);
        res.status(500).json({ message: 'Server error' });
    }
}