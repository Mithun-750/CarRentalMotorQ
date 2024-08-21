import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';

const AdminSignIn = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { login, isLoggedIn } = useContext(AuthContext);

    useEffect(() => {
        if (isLoggedIn) {
            window.location.href = '/'; // Redirect if already logged in
        }
    }, [isLoggedIn]);

    const handleSignIn = async (e) => {
        e.preventDefault();
        try {
            await login(username, password, true); // true for admin user
        } catch (error) {
            alert('Failed to sign in');
        }
    };

    return (
        <div className='min-h-screen p-6 bg-gray-100 dark:bg-gray-900 flex items-center justify-center'>
            <div className="w-full max-w-sm mx-auto overflow-hidden bg-white rounded-lg shadow-md dark:bg-gray-800">
                <div className="px-6 py-4">
                    <h3 className="mt-3 text-xl font-medium text-center text-gray-600 dark:text-gray-200">Admin Sign In</h3>
                    <p className="mt-1 text-center text-gray-500 dark:text-gray-400">Sign in to your admin account</p>
                    <form onSubmit={handleSignIn}>
                        <div className="w-full mt-4">
                            <input
                                className="block w-full px-4 py-2 mt-2 text-gray-100 placeholder-gray-500 bg-white border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring focus:ring-blue-300"
                                type="text"
                                placeholder="Username"
                                aria-label="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                        <div className="w-full mt-4">
                            <input
                                className="block w-full px-4 py-2 mt-2 text-gray-100 placeholder-gray-500 bg-white border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring focus:ring-blue-300"
                                type="password"
                                placeholder="Password"
                                aria-label="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="flex items-center justify-between mt-4">
                            <a href="#" className="text-sm text-gray-600 dark:text-gray-200 hover:text-gray-500">Forgot Password?</a>
                            <button
                                type="submit"
                                className="px-6 py-2 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-500 rounded-lg hover:bg-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50"
                            >
                                Sign In
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AdminSignIn;
