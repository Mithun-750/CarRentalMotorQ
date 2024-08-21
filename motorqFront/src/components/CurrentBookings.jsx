import React, { useContext, useEffect, useState } from 'react';
import { BookingContext } from '../context/BookingContext';

const CurrentBookings = () => {
    const { bookings, fetchCurrentBookings, error } = useContext(BookingContext);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCurrentBookings() // Fetch current bookings
            .finally(() => setLoading(false)); // Ensure loading state is updated
    }, []);

    // Sort bookings by status and end date
    const sortedBookings = bookings.slice().sort((a, b) => {
        // Sort by end date (latest first)
        return new Date(b.endDateTime) - new Date(a.endDateTime);
    });

    if (loading) return <div className="text-center text-gray-600 dark:text-gray-300">Loading...</div>;
    if (error) return <div className="text-center text-red-600 dark:text-red-400">Error: {error}</div>;

    return (
        <div className="min-h-screen p-6 bg-gray-100 dark:bg-gray-900">
            <h1 className="text-4xl font-bold text-center text-gray-800 dark:text-white mb-8">Current Bookings</h1>

            <div className="flex items-center justify-center max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                {sortedBookings.length === 0 ? (
                    <p className="text-lg text-gray-600 dark:text-gray-400 text-center">You have no current bookings.</p>
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
                                <div className="text-lg font-semibold text-gray-800 dark:text-white mb-2 capitalize">
                                    {booking.customerID.name} - {booking.customerID.email}
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default CurrentBookings;
