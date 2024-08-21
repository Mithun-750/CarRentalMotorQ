import React, { createContext, useState, useEffect, useContext } from 'react';
import { SocketContext } from './SocketContext';

// Create context
export const CarContext = createContext();

// Provider component
export const CarProvider = ({ children }) => {
    const { carUpdates, socket } = useContext(SocketContext);
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch all cars from the server
    const getAllCars = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/cars');
            const data = await response.json();
            setCars(data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching cars:', err);
            setLoading(false);
        }
    };

    useEffect(() => {
        // Fetch cars when the component mounts
        getAllCars();
    }, []);

    useEffect(() => {
        // Update cars with new updates from WebSocket
        if (carUpdates.length > 0) {
            setCars(prevCars => [...prevCars, ...carUpdates]);
        }
    }, [carUpdates]);

    // Add a new car to the server and update local state
    const addCar = async (newCar) => {
        try {
            const token = sessionStorage.getItem('token'); // Retrieve token from sessionStorage
            const response = await fetch('http://localhost:5000/api/cars/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token // Send token in headers
                },
                body: JSON.stringify(newCar)
            });

            if (!response.ok) {
                throw new Error('Failed to add car');
            }

            const savedCar = await response.json();
            setCars([...cars, savedCar]);

            // Emit an update to WebSocket
            socket.emit('carUpdate', savedCar);
        } catch (err) {
            console.error('Error adding car:', err);
        }
    };

    // Delete a car from the server and update local state
    const deleteCar = async (id) => {
        try {
            const token = sessionStorage.getItem('token'); // Retrieve token from sessionStorage
            const response = await fetch(`http://localhost:5000/api/cars/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': token // Send token in headers
                }
            });

            if (!response.ok) {
                throw new Error('Failed to delete car');
            }

            setCars(cars.filter(car => car._id !== id));
        } catch (err) {
            console.error('Error deleting car:', err);
        }
    };

    // Update a car on the server and update local state
    const updateCar = async (id, updatedCar) => {
        try {
            const token = sessionStorage.getItem('token'); // Retrieve token from sessionStorage
            const response = await fetch(`http://localhost:5000/api/cars/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token // Send token in headers
                },
                body: JSON.stringify(updatedCar)
            });

            if (!response.ok) {
                throw new Error('Failed to update car');
            }

            const updatedCarData = await response.json();
            setCars(cars.map(car => (car._id === id ? updatedCarData : car)));

            // Emit an update to WebSocket
            socket.emit('carUpdate', updatedCarData);
        } catch (err) {
            console.error('Error updating car:', err);
        }
    };

    const getCarReviews = async (carId) => {
        try {
            const response = await fetch(`http://localhost:5000/api/cars/reviews/${carId}`);
            if (!response.ok) throw new Error('Error fetching reviews');
            return await response.json();
        } catch (error) {
            console.error('Error fetching reviews:', error);
            return [];
        }
    };

    return (
        <CarContext.Provider value={{ cars, addCar, deleteCar, updateCar, loading, getCarReviews }}>
            {children}
        </CarContext.Provider>
    );
};
