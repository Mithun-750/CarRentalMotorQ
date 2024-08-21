import React, { useContext, useState, useEffect } from 'react';
import { CarContext } from '../context/CarContext';
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const AddCars = () => {
    const { addCar, loading } = useContext(CarContext);
    const [newCar, setNewCar] = useState({
        make: '',
        model: '',
        year: '',
        regNo: '',
        rate: '',
        location: { lat: '', lng: '' } // Change location to an object
    });
    const [mapCenter, setMapCenter] = useState([13.553887, 80.023234]); // Default center if location is not available

    useEffect(() => {
        // Get the current location
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setMapCenter([position.coords.latitude, position.coords.longitude]);
                setNewCar(prevCar => ({
                    ...prevCar,
                    location: {
                        // [13.553887, 80.023234]
                        // lat: position.coords.latitude.toFixed(6),
                        // lng: position.coords.longitude.toFixed(6)
                        lat: 13.553887,
                        lng: 80.023234
                    }
                }));
            },
            (error) => {
                console.error("Error getting location", error);
            }
        );
    }, []);

    // Handle form input changes
    const handleChange = (e) => {
        setNewCar({ ...newCar, [e.target.name]: e.target.value });
    };

    // Handle form submission to add a car
    const handleSubmit = (e) => {
        e.preventDefault();
        addCar(newCar); // Call addCar function from CarContext with the form data
        setNewCar({
            make: '',
            model: '',
            year: '',
            regNo: '',
            rate: '',
            location: { lat: '', lng: '' } // Reset location to default
        });
        window.location.href = '/';
    };

    // Leaflet map component to handle click events
    const LocationMap = ({ setNewCar }) => {
        useMapEvents({
            click(e) {
                const { lat, lng } = e.latlng;
                setNewCar(prevCar => ({
                    ...prevCar,
                    location: {
                        lat: lat.toFixed(6),
                        lng: lng.toFixed(6)
                    }
                }));
            }
        });

        return null;
    };

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    return (
        <div className="min-h-screen p-6 bg-gray-100 dark:bg-gray-900">
            <h2 className="text-3xl font-semibold text-center text-gray-800 dark:text-white mb-8">Admin Panel - Manage Cars</h2>

            <form onSubmit={handleSubmit} className="max-w-xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                <div className="mb-4">
                    <label className="block text-sm text-gray-600 dark:text-gray-300">Make</label>
                    <input
                        type="text"
                        name="make"
                        value={newCar.make}
                        onChange={handleChange}
                        placeholder="Make"
                        className="w-full mt-2 p-2 rounded-lg border border-gray-200 bg-gray-50 dark:bg-gray-900 dark:text-white dark:border-gray-700 focus:border-blue-400 focus:ring focus:ring-blue-200 focus:outline-none"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm text-gray-600 dark:text-gray-300">Model</label>
                    <input
                        type="text"
                        name="model"
                        value={newCar.model}
                        onChange={handleChange}
                        placeholder="Model"
                        className="w-full mt-2 p-2 rounded-lg border border-gray-200 bg-gray-50 dark:bg-gray-900 dark:text-white dark:border-gray-700 focus:border-blue-400 focus:ring focus:ring-blue-200 focus:outline-none"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm text-gray-600 dark:text-gray-300">Year</label>
                    <input
                        type="text"
                        name="year"
                        value={newCar.year}
                        onChange={handleChange}
                        placeholder="Year"
                        className="w-full mt-2 p-2 rounded-lg border border-gray-200 bg-gray-50 dark:bg-gray-900 dark:text-white dark:border-gray-700 focus:border-blue-400 focus:ring focus:ring-blue-200 focus:outline-none"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm text-gray-600 dark:text-gray-300">Reg. No</label>
                    <input
                        type="text"
                        name="regNo"
                        value={newCar.regNo}
                        onChange={handleChange}
                        placeholder="Reg. No"
                        className="w-full mt-2 p-2 rounded-lg border border-gray-200 bg-gray-50 dark:bg-gray-900 dark:text-white dark:border-gray-700 focus:border-blue-400 focus:ring focus:ring-blue-200 focus:outline-none"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm text-gray-600 dark:text-gray-300">Rent Rate ($/day)</label>
                    <input
                        type="text"
                        name="rate"
                        value={newCar.rate}
                        onChange={handleChange}
                        placeholder="Rent Rate"
                        className="w-full mt-2 p-2 rounded-lg border border-gray-200 bg-gray-50 dark:bg-gray-900 dark:text-white dark:border-gray-700 focus:border-blue-400 focus:ring focus:ring-blue-200 focus:outline-none"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm text-gray-600 dark:text-gray-300">Location (Click on the map to set)</label>
                    <div className="relative h-64">
                        <MapContainer center={mapCenter} zoom={13} className="w-full h-full">
                            <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            />
                            <LocationMap setNewCar={setNewCar} />
                            {newCar.location.lat && newCar.location.lng && (
                                <Marker
                                    position={[parseFloat(newCar.location.lat), parseFloat(newCar.location.lng)]}
                                    icon={L.icon({
                                        iconUrl: 'https://img.icons8.com/?size=100&id=7880&format=png&color=000000',
                                        iconSize: [35, 35]
                                    })}
                                />
                            )}
                        </MapContainer>
                    </div>
                </div>
                <button
                    type="submit"
                    className="w-full px-6 py-2 mt-4 text-white bg-blue-600 rounded-lg hover:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-300 transition duration-300">
                    Add Car
                </button>
            </form>
        </div>
    );
};

export default AddCars;
