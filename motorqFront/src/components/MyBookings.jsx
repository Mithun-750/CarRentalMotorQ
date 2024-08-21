import React, { useContext, useEffect, useState } from 'react';
import { BookingContext } from '../context/BookingContext';
import { AuthContext } from '../context/AuthContext';
import ReviewModal from './ReviewModal';

const MyBookings = () => {
    const { user } = useContext(AuthContext); // Get the current user
    const { bookings, fetchBookingsForCustomer, cancelBooking, error } = useContext(BookingContext);
    const [loading, setLoading] = useState(true);
    const [selectedBookingID, setSelectedBookingID] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        if (user) {
            fetchBookingsForCustomer() // Fetch bookings for the logged-in user
                .finally(() => setLoading(false)); // Ensure loading state is updated
        }
    }, [user]);

    const handleCancelClick = (bookingID) => {
        setSelectedBookingID(bookingID);
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setSelectedBookingID(null);
    };

    const handleModalSubmit = async (bookingID, feedback, rating) => {
        await cancelBooking(bookingID, feedback, rating);
    };

    // Sort bookings by status and end date
    const sortedBookings = bookings.slice().sort((a, b) => {
        // Sort by status first: 'Booked' comes before 'Completed'
        if (a.status === 'Booked' && b.status === 'Completed') return -1;
        if (a.status === 'Completed' && b.status === 'Booked') return 1;

        // If the status is the same, sort by end date (latest first)
        return new Date(b.endDateTime) - new Date(a.endDateTime);
    });

    if (loading) return <div className="text-center text-gray-600 dark:text-gray-300">Loading...</div>;
    if (error) return <div className="text-center text-red-600 dark:text-red-400">Error: {error}</div>;

    return (
        <div className="min-h-screen p-6 bg-gray-100 dark:bg-gray-900">
            <h1 className="text-4xl font-bold text-center text-gray-800 dark:text-white mb-8">My Bookings</h1>

            <div className="flex items-center justify-center max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                {sortedBookings.length === 0 ? (
                    <p className="text-lg text-gray-600 dark:text-gray-400 text-center">You have no bookings yet.</p>
                ) : (
                    <ul className="flex flex-wrap gap-4 justify-center">
                        {sortedBookings.map(booking => (
                            <li
                                key={booking._id}
                                className="w-[300px] p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-md text-center">
                                <div className="text-lg font-semibold text-gray-800 dark:text-white mb-2 capitalize">
                                    {booking.carID.make} {booking.carID.model} - {booking.carID.year}
                                </div>
                                <div className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                                    Rent: {booking.carID.rate}$/day
                                </div>
                                <div className="text-md text-gray-600 dark:text-gray-400 mb-2">
                                    Registration: {booking.carID.regNo}
                                </div>
                                <div className="text-md text-gray-600 dark:text-gray-400 mb-2">
                                    Start: {new Date(booking.startDateTime).toLocaleString()}
                                </div>
                                <div className="text-md text-gray-600 dark:text-gray-400 mb-2">
                                    End: {new Date(booking.endDateTime).toLocaleString()}
                                </div>
                                {booking.status !== 'Booked' && (
                                    <div>
                                        {/* Rating Stars Component */}
                                        <div className="flex items-center justify-center mt-4 mb-1">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <svg
                                                    key={star}
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill={star <= (booking.rating || 0) ? "currentColor" : "none"}
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                    className={`w-6 h-6 ${star <= (booking.rating || 0) ? 'text-yellow-500' : 'text-gray-300'}`}
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="2"
                                                        d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                                                    />
                                                </svg>
                                            ))}
                                        </div>

                                        <div className="text-lg text-gray-600 dark:text-gray-400 mb-4">
                                            Review: {booking.feedback || 'No feedback provided'}
                                        </div>
                                    </div>
                                )}


                                {booking.status === 'Booked' && (
                                    <button
                                        onClick={() => handleCancelClick(booking._id)}
                                        className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-500 focus:outline-none focus:ring focus:ring-red-300 transition duration-300">
                                        Cancel
                                    </button>
                                )}
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <ReviewModal
                isOpen={isModalOpen}
                onClose={handleModalClose}
                onSubmit={handleModalSubmit}
                bookingID={selectedBookingID}
            />
        </div>
    );
};

export default MyBookings;
