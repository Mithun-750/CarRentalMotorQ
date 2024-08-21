import React, { createContext, useState, useEffect, useContext } from 'react';
import { AuthContext } from './AuthContext';
import { SocketContext } from './SocketContext';

// Create context
export const BookingContext = createContext();

// Provider component
export const BookingProvider = ({ children }) => {
    const { bookingUpdates } = useContext(SocketContext);
    const { isAdmin } = useContext(AuthContext);
    const [bookings, setBookings] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Apply updates from WebSocket
        setBookings(prevBookings => [...prevBookings, ...bookingUpdates]);
    }, [bookingUpdates]);

    const checkCarStatus = async (carID, startDateTime, endDateTime) => {
        try {
            const response = await fetch(`http://localhost:5000/api/booking/car/${carID}`);
            const data = await response.json();
            if (response.ok) {
                // Check for overlap with existing bookings
                const isBooked = data.bookings.some((booking) => {
                    const bookingStart = new Date(booking.startDateTime);
                    const bookingEnd = new Date(booking.endDateTime);

                    return (
                        (new Date(startDateTime) >= bookingStart && new Date(startDateTime) < bookingEnd) ||
                        (new Date(endDateTime) > bookingStart && new Date(endDateTime) <= bookingEnd) ||
                        (new Date(startDateTime) <= bookingStart && new Date(endDateTime) >= bookingEnd)
                    );
                });

                return isBooked;  // true if booked, false if available
            } else {
                console.error('Error fetching booking status:', data.message);
                return { status: 'Error', message: data.message };
            }
        } catch (error) {
            console.error('Error fetching booking status:', error);
            return { status: 'Error', message: error.message };
        }
    };

    const fetchBookingsForCar = async (carID) => {
        try {
            const response = await fetch(`http://localhost:5000/api/booking/car/${carID}`);
            const data = await response.json();
            setBookings(data);
            return data;
        } catch (err) {
            setError('Failed to fetch bookings.');
        }
    };

    const fetchBookingsForCustomer = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/booking/customer`, {
                headers: {
                    'Authorization': `${sessionStorage.getItem('token')}`
                }
            });
            const data = await response.json();
            setBookings(data);
        } catch (err) {
            setError('Failed to fetch customer bookings.');
        }
    };

    const fetchCurrentBookings = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/booking/current');
            const data = await response.json();
            setBookings(data);
            return (data)
        } catch (err) {
            setError('Failed to fetch current bookings.');
        }
    };

    const bookCar = async (carID, startDateTime, endDateTime) => {
        if (isAdmin) {
            setError('Admins cannot book cars.');
            return;
        }
        try {
            const response = await fetch('http://localhost:5000/api/booking/book', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${sessionStorage.getItem('token')}`
                },
                body: JSON.stringify({ carID, startDateTime, endDateTime })
            });
            if (!response.ok) {
                const errorData = await response.json();
                setError(errorData.msg || 'Failed to book the car.');
                return;
            }
            const newBooking = await response.json();
            setBookings(prev => [...prev, newBooking]);

            // Emit an update to WebSocket
            socket.emit('bookingUpdate', newBooking);
        } catch (err) {
            setError('Failed to book the car.');
        }
    };

    const cancelBooking = async (bookingID, feedback = '', rating = '') => {
        try {
            const response = await fetch(`http://localhost:5000/api/booking/cancel/${bookingID}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${sessionStorage.getItem('token')}`
                },
                body: JSON.stringify({ feedback, rating })
            });
            if (!response.ok) {
                const errorData = await response.json();
                setError(errorData.msg || 'Failed to cancel the booking.');
                return;
            }
            alert('confirmation email sent!')
        } catch (err) {
            setError('Failed to cancel the booking.');
        }
    };

    const isCarBooked = async (carId, startDateTime, endDateTime) => {
        try {
            const bk = await fetchBookingsForCar(carId);

            const start = new Date(startDateTime);
            const end = new Date(endDateTime);

            if (carId === undefined || carId === null) {
                throw new Error('carId is undefined or null');
            }

            const carIdStr = carId.toString();
            const conflictingBookings = [];

            for (let i = 0; i < bk.length; i++) {
                const booking = bk[i];

                if (!booking || booking.startDateTime === undefined || booking.endDateTime === undefined || booking.carID === undefined) {
                    console.error('Booking or its properties are undefined:', booking);
                    continue;
                }

                const bookingStart = new Date(booking.startDateTime);
                const bookingEnd = new Date(booking.endDateTime);
                const bookingCarIdStr = booking.carID.toString();

                if (bookingCarIdStr === carIdStr && booking.status === "Booked" &&
                    ((start >= bookingStart && start < bookingEnd) ||
                        (end > bookingStart && end <= bookingEnd) ||
                        (start <= bookingStart && end >= bookingEnd))) {
                    conflictingBookings.push({
                        startDateTime: booking.startDateTime,
                        endDateTime: booking.endDateTime
                    });
                }
            }

            return conflictingBookings;
        } catch (error) {
            console.error('Error in isCarBooked function:', error);
            return []; // Return an empty array in case of an error
        }
    };

    return (
        <BookingContext.Provider value={{ bookings, error, bookCar, cancelBooking, fetchBookingsForCar, fetchBookingsForCustomer, fetchCurrentBookings, checkCarStatus, isCarBooked }}>
            {children}
        </BookingContext.Provider>
    );
};
