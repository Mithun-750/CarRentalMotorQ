import React, { createContext, useEffect, useState } from 'react';
import io from 'socket.io-client';

export const SocketContext = createContext();

const socket = io('http://localhost:5000');

export const SocketProvider = ({ children }) => {
    const [carUpdates, setCarUpdates] = useState([]);
    const [bookingUpdates, setBookingUpdates] = useState([]);

    useEffect(() => {
        socket.on('carUpdate', (carData) => {
            setCarUpdates(prev => [...prev, carData]);
        });

        socket.on('bookingUpdate', (bookingData) => {
            setBookingUpdates(prev => [...prev, bookingData]);
        });

        return () => {
            socket.off('carUpdate');
            socket.off('bookingUpdate');
        };
    }, []);

    return (
        <SocketContext.Provider value={{ socket, carUpdates, bookingUpdates }}>
            {children}
        </SocketContext.Provider>
    );
};
