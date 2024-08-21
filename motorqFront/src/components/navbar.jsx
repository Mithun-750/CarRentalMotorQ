import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { isAdmin, isLoggedIn, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/signin');
    };

    return (
        <nav className="relative bg-white shadow dark:bg-gray-800">
            <div className="container px-6 py-4 mx-auto md:flex md:justify-between md:items-center">
                <div className="flex items-center justify-between">
                    <a href="/">
                        <h1 className='text-white text-3xl font-bold'>CarRental</h1>
                    </a>

                    <div className="flex md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            type="button"
                            className="text-gray-500 dark:text-gray-200 hover:text-gray-600 dark:hover:text-gray-400 focus:outline-none focus:text-gray-600 dark:focus:text-gray-400"
                            aria-label="toggle menu"
                        >
                            {isOpen ? (
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 8h16M4 16h16" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>

                <div
                    className={`absolute inset-x-0 z-20 w-full px-6 py-4 transition-all duration-300 ease-in-out bg-white dark:bg-gray-800 md:mt-0 md:p-0 md:top-0 md:relative md:bg-transparent md:w-auto md:opacity-100 md:translate-x-0 md:flex md:items-center ${isOpen ? 'translate-x-0 opacity-100' : 'opacity-0 -translate-x-full'}`}
                >
                    {isLoggedIn ? (
                        <div className="flex flex-col items-center md:flex-row md:mx-6">
                            <a className="my-2 text-gray-700 transition-colors duration-300 transform dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400 md:mx-4 md:my-0" href="/">
                                Home
                            </a>
                            {isAdmin ? (
                                <>
                                    <a className="my-2 text-gray-700 transition-colors duration-300 transform dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400 md:mx-4 md:my-0" href="/addcar">
                                        Add Car
                                    </a>
                                    <a className="my-2 text-gray-700 transition-colors duration-300 transform dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400 md:mx-4 md:my-0" href="/currentbookings">
                                        Currunt Bookings
                                    </a>
                                </>
                            ) : (
                                <>
                                    <a className="my-2 text-gray-700 transition-colors duration-300 transform dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400 md:mx-4 md:my-0" href="/mybookings">
                                        My Bookings
                                    </a>
                                </>
                            )}
                            <button
                                onClick={handleLogout}
                                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-400"
                            >
                                Logout
                            </button>
                        </div>
                    ) :
                        <a href="/signin">
                            <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-400">
                                Sign In
                            </button>
                        </a>

                    }
                </div>
            </div>
        </nav>
    );
};
