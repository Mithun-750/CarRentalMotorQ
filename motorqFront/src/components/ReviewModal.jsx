import React, { useState } from 'react';

const ReviewModal = ({ isOpen, onClose, onSubmit, bookingID }) => {
    const [rating, setRating] = useState(0);
    const [feedback, setFeedback] = useState('');

    if (!isOpen) return null;

    const handleStarClick = (value) => {
        setRating(value);
    };

    const handleSubmit = () => {
        onSubmit(bookingID, feedback, rating);
        onClose(); // Close modal after submission
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white text-center dark:bg-gray-800 rounded-lg shadow-lg p-6 w-1/3">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Leave a Review</h2>
                <div className="flex items-center mb-4 mx-auto w-fit">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <svg
                            key={star}
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill={rating >= star ? 'currentColor' : 'none'}
                            stroke={rating >= star ? 'none' : 'currentColor'}
                            className={`w-6 h-6 cursor-pointer ${rating >= star ? 'text-yellow-400' : 'text-gray-400'}`}
                            onClick={() => handleStarClick(star)}
                        >
                            <path
                                fillRule="evenodd"
                                d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                                clipRule="evenodd"
                            />
                        </svg>
                    ))}
                </div>
                <label className="block text-gray-700 dark:text-gray-200 mb-2">
                    Review:
                    <textarea
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        className="w-full p-2 rounded-lg border border-gray-200 bg-gray-50 dark:bg-gray-600 dark:text-white dark:border-gray-700 mt-1"
                        rows="4"
                    />
                </label>
                <div className="flex justify-end gap-4 mt-4">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-white bg-gray-600 rounded-lg hover:bg-gray-500 focus:outline-none focus:ring focus:ring-gray-300 transition duration-300">
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-500 focus:outline-none focus:ring focus:ring-red-300 transition duration-300">
                        Submit
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReviewModal;
