import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Check for token, isAdmin, and isLoggedIn on initial load
        const token = sessionStorage.getItem('token');
        const storedIsAdmin = sessionStorage.getItem('isAdmin') === 'true';
        const storedIsLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';

        if (token && storedIsLoggedIn) {
            setUser({ username: 'YourUsername' }); // Replace with actual user data if needed
        }
    }, []);

    const login = async (username, password, isAdminFlag) => {
        try {
            const url = isAdminFlag ? 'http://localhost:5000/api/admins/login' : 'http://localhost:5000/api/customers/login';
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });

            if (!response.ok) {
                throw new Error('Login failed');
            }

            const data = await response.json();
            sessionStorage.setItem('token', data.token);
            sessionStorage.setItem('isAdmin', isAdminFlag.toString());
            sessionStorage.setItem('isLoggedIn', 'true');
            setUser({ username });
            window.location.href = '/';
        } catch (error) {
            console.error(error);
        }
    };

    const signup = async (name, username, password, email) => {
        try {
            const url = 'http://localhost:5000/api/customers/signup';
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, username, password, email })
            });

            if (!response.ok) {
                throw new Error('Signup failed');
            }

            const data = await response.json();
            sessionStorage.setItem('token', data.token);
            sessionStorage.setItem('isAdmin', 'false');
            sessionStorage.setItem('isLoggedIn', 'true');
            setUser({ username });
            window.location.href = '/';
        } catch (error) {
            console.error(error);
        }
    };

    const logout = () => {
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('isAdmin');
        sessionStorage.removeItem('isLoggedIn');
        setUser(null);
        window.location.href = '/signin';
    };

    return (
        <AuthContext.Provider value={{ user, isAdmin: sessionStorage.getItem('isAdmin') === 'true', isLoggedIn: sessionStorage.getItem('isLoggedIn') === 'true', login, signup, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
