const mongoose = require('mongoose');

const CarSchema = new mongoose.Schema({
    make: { type: String, required: true },
    model: { type: String, required: true },
    year: { type: Number, required: true },
    regNo: { type: String, required: true, unique: true },
    rate: { type: Number, required: true },
    location: {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true }
    },
    customerID: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
    averageRating: { type: Number, default: 0 }
});

CarSchema.methods.calculateAverageRating = async function () {
    const car = this;
    const bookings = await Booking.find({ carID: car._id });
    if (bookings.length === 0) return 0;

    const totalRating = bookings.reduce((sum, booking) => sum + (booking.rating || 0), 0);
    return totalRating / bookings.length;
};

module.exports = mongoose.model('Car', CarSchema);
