const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
    carID: { type: mongoose.Schema.Types.ObjectId, ref: 'Car', required: true },
    customerID: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
    startDateTime: { type: Date, required: true }, // Combine date and time into a single Date field
    endDateTime: { type: Date, required: true },   // Combine date and time into a single Date field
    status: { type: String, enum: ['Booked', 'Cancelled', 'Completed'], default: 'Booked' },
    feedback: { type: String },
    rating: { type: Number, min: 1, max: 5 }
});

// Calculate the duration dynamically
BookingSchema.methods.getDurationInHours = function() {
    const duration = (this.endDateTime - this.startDateTime) / (1000 * 60 * 60);
    return duration;
};

module.exports = mongoose.model('Booking', BookingSchema);
