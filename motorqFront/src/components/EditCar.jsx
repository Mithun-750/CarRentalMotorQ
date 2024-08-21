import React, { useContext, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Import useNavigate
import { CarContext } from '../context/CarContext';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const EditCar = () => {
    const { registration } = useParams();
    const decodedRegistration = decodeURIComponent(registration);
    const { cars, updateCar, loading } = useContext(CarContext);
    const [car, setCar] = useState(null);
    const [mapCenter, setMapCenter] = useState([51.505, -0.09]); // Default center for map
    const navigate = useNavigate();

    useEffect(() => {
        const carDetail = cars.find(car => car.regNo === decodedRegistration);
        setCar(carDetail);
        if (carDetail) {
            setMapCenter([carDetail.location.lat, carDetail.location.lng]);
        }
    }, [decodedRegistration, cars]);

    // Handle form input changes
    const handleChange = (e) => {
        setCar({ ...car, [e.target.name]: e.target.value });
    };

    // Handle form submission to update a car
    const handleSubmit = async (e) => {
        e.preventDefault();
        await updateCar(car._id, car);
        navigate(`/car/${car.regNo}`); // Redirect to the car details page using navigate
    };

    // Leaflet map component to handle click events
    const LocationMap = ({ setCar }) => {
        useMapEvents({
            click(e) {
                const { lat, lng } = e.latlng;
                setCar(prevCar => ({
                    ...prevCar,
                    location: {
                        lat: lat.toFixed(6),
                        lng: lng.toFixed(6)
                    }
                }));
                setMapCenter([lat, lng]); // Update the map center to reflect the new location
            }
        });

        return null;
    };

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    if (!car) return <div className="min-h-screen flex items-center justify-center text-white">Loading...</div>;

    return (
        <div className="min-h-screen p-6 bg-gray-100 dark:bg-gray-900">
            <h2 className="text-3xl font-semibold text-center text-gray-800 dark:text-white mb-8">Edit Car Details</h2>

            <form onSubmit={handleSubmit} className="max-w-xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                <div className="mb-4">
                    <label className="block text-sm text-gray-600 dark:text-gray-300">Make</label>
                    <input
                        type="text"
                        name="make"
                        value={car.make}
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
                        value={car.model}
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
                        value={car.year}
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
                        value={car.regNo}
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
                        value={car.rate}
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
                            <LocationMap setCar={setCar} />
                            {car.location.lat && car.location.lng && (
                                <Marker
                                    position={[parseFloat(car.location.lat), parseFloat(car.location.lng)]}
                                    icon={L.icon({
                                        iconUrl: 'https://img.icons8.com/?size=100&id=7880&format=png&color=FF0000',
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
                    Update Car
                </button>
            </form>
        </div>
    );
};

export default EditCar;
