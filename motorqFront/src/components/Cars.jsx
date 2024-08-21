import React, { useContext, useState, useEffect } from 'react';
import { CarContext } from '../context/CarContext';
import { AuthContext } from '../context/AuthContext';
import { BookingContext } from '../context/BookingContext';
import { MapContainer, TileLayer, Marker, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Link } from 'react-router-dom';

const Cars = () => {
    const { cars, deleteCar } = useContext(CarContext);
    const { fetchBookingsForCar, isCarBooked, bookCar } = useContext(BookingContext);
    const { isAdmin } = useContext(AuthContext);
    const [selectedCar, setSelectedCar] = useState(null);
    const [startDateTime, setStartDateTime] = useState('');
    const [endDateTime, setEndDateTime] = useState('');
    const [filters, setFilters] = useState({
        make: '',
        model: '',
        minRent: '',
        maxRent: ''
    });
    const [isBooked, setIsBooked] = useState(false);
    const [currentLocation, setCurrentLocation] = useState(null);
    const [clickedMarkerCarId, setClickedMarkerCarId] = useState(null);
    const [carStatus, setCarStatus] = useState({});
    const [conflictingBookings, setConflictingBookings] = useState([]);
    const [showModal, setShowModal] = useState(false);


    useEffect(() => {
        const fetchLocation = () => {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setCurrentLocation([position.coords.latitude, position.coords.longitude]);
                },
                (error) => {
                    console.error("Error getting location", error);
                }
            );
        };

        fetchLocation();
    }, []);

    useEffect(() => {
        const checkStatus = async () => {
            if (selectedCar && startDateTime && endDateTime) {
                const conflicts = await isCarBooked(selectedCar, startDateTime, endDateTime);
                if (conflicts.length > 0) {
                    setConflictingBookings(conflicts);
                    setShowModal(true);
                    setStartDateTime('')
                    setEndDateTime('')
                    
                } else {
                    setShowModal(false);
                }
            }
        };

        checkStatus();
    }, [selectedCar, startDateTime, endDateTime, isCarBooked]);

    useEffect(() => {
        const fetchCarStatuses = async () => {
            const statuses = {};
            for (const car of cars) {
                const bookings = await fetchBookingsForCar(car._id);
                const now = new Date();
                const isInTrip = bookings.some(booking => 
                    new Date(booking.startDateTime) <= now &&
                    new Date(booking.endDateTime) >= now &&
                    booking.status === 'Booked'
                );
                
                statuses[car._id] = isInTrip ? 'In-Trip' : 'In-Garage';
            }
            setCarStatus(statuses);
        };

        if (cars.length) {
            fetchCarStatuses();
        }
    }, [cars, fetchBookingsForCar]);

    const handleBook = async () => {
        if (!startDateTime || !endDateTime) {
            alert('Please provide both start and end date-times.');
            return;
        }

        if (isBooked) {
            alert('Car is already booked for the selected date-time range.');
            return;
        }

        await bookCar(selectedCar, startDateTime, endDateTime);
        setSelectedCar(null);
        setStartDateTime('');
        setEndDateTime('');
        setIsBooked(false);
        window.location.href = '/mybookings';
    };


    const handleSelectDeselect = (carId) => {
        if (selectedCar === carId) {
            setSelectedCar(null);
            setStartDateTime('');
            setEndDateTime('');
            setIsBooked(false);
        } else {
            setSelectedCar(carId);
        }
    };

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const filteredCars = clickedMarkerCarId
        ? cars.filter(car => car._id === clickedMarkerCarId)
        : cars.filter(car => {
            const matchesMake = filters.make === '' || car.make.toLowerCase().includes(filters.make.toLowerCase());
            const matchesModel = filters.model === '' || car.model.toLowerCase().includes(filters.model.toLowerCase());
            const matchesRent =
                (filters.minRent === '' || car.rate >= parseFloat(filters.minRent)) &&
                (filters.maxRent === '' || car.rate <= parseFloat(filters.maxRent));
            return matchesMake && matchesModel && matchesRent;
        });

    const handleMarkerClick = (carId) => {
        if (clickedMarkerCarId === carId) {
            setClickedMarkerCarId(null);
        } else {
            setClickedMarkerCarId(carId);
        }
    };

    return (
        <div className="min-h-screen p-6 bg-gray-100 dark:bg-gray-900">
            <h1 className="text-4xl font-bold text-center text-gray-800 dark:text-white mb-8">Available Cars</h1>

            <div className='flex flex-wrap items-center justify-center gap-5 my-4'>
                <div className="max-w-[90%] min-w-[40%] mb-8 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
                    <h3 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">Filters</h3>
                    <div className="mb-4">
                        <label className="block text-sm text-gray-600 dark:text-gray-300">Make:</label>
                        <input
                            type="text"
                            name="make"
                            value={filters.make}
                            onChange={handleFilterChange}
                            placeholder="Filter by make"
                            className="w-full mt-2 p-2 rounded-lg border border-gray-200 bg-gray-50 dark:bg-gray-900 dark:text-white dark:border-gray-700 focus:border-blue-400 focus:ring focus:ring-blue-200 focus:outline-none"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm text-gray-600 dark:text-gray-300">Model:</label>
                        <input
                            type="text"
                            name="model"
                            value={filters.model}
                            onChange={handleFilterChange}
                            placeholder="Filter by model"
                            className="w-full mt-2 p-2 rounded-lg border border-gray-200 bg-gray-50 dark:bg-gray-900 dark:text-white dark:border-gray-700 focus:border-blue-400 focus:ring focus:ring-blue-200 focus:outline-none"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm text-gray-600 dark:text-gray-300">Rent (min):</label>
                        <input
                            type="number"
                            name="minRent"
                            value={filters.minRent}
                            onChange={handleFilterChange}
                            placeholder="Min rent"
                            className="w-full mt-2 p-2 rounded-lg border border-gray-200 bg-gray-50 dark:bg-gray-900 dark:text-white dark:border-gray-700 focus:border-blue-400 focus:ring focus:ring-blue-200 focus:outline-none"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm text-gray-600 dark:text-gray-300">Rent (max):</label>
                        <input
                            type="number"
                            name="maxRent"
                            value={filters.maxRent}
                            onChange={handleFilterChange}
                            placeholder="Max rent"
                            className="w-full mt-2 p-2 rounded-lg border border-gray-200 bg-gray-50 dark:bg-gray-900 dark:text-white dark:border-gray-700 focus:border-blue-400 focus:ring focus:ring-blue-200 focus:outline-none"
                        />
                    </div>
                </div>

                {selectedCar && (
                    <div className="max-w-[80%] min-w-[35%] p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
                        <h3 className="text-2xl font-semibold text-center text-gray-800 dark:text-white mb-6">Booking Details</h3>
                        <div className="mb-4">
                            <label className="block text-sm text-gray-600 dark:text-gray-300 mb-2">Start Date-Time:</label>
                            <input
                                type="datetime-local"
                                value={startDateTime}
                                onChange={(e) => setStartDateTime(e.target.value)}
                                className="w-full mt-2 p-2 rounded-lg border border-gray-200 bg-gray-50 dark:bg-gray-600 dark:text-white dark:border-gray-700 focus:border-blue-400 focus:ring focus:ring-blue-200 focus:outline-none"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm text-gray-600 dark:text-gray-300 mb-2">End Date-Time:</label>
                            <input
                                type="datetime-local"
                                value={endDateTime}
                                onChange={(e) => setEndDateTime(e.target.value)}
                                className="w-full mt-2 p-2 rounded-lg border border-gray-200 bg-gray-50 dark:bg-gray-600 dark:text-white dark:border-gray-700 focus:border-blue-400 focus:ring focus:ring-blue-200 focus:outline-none"
                            />
                        </div>
                        <button
                            onClick={handleBook}
                            className="w-full px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-300 transition duration-300"
                            disabled={isBooked}  // This will disable the button if isBooked is true
                        >
                            {isBooked ? 'Car is Booked' : 'Book Car'}
                        </button>

                    </div>
                )}
            </div>

            <div className="relative h-[350px] my-6 rounded overflow-hidden">
                <MapContainer center={[13.553887, 80.023234]} zoom={13} className="w-full h-full">
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    {currentLocation && (
                        <Marker
                            position={[13.553887, 80.023234]}
                            icon={L.icon({ iconUrl: 'https://img.icons8.com/?size=100&id=7880&format=png&color=000000', iconSize: [40, 40] })}
                        />
                    )}
                    {cars.map(car => (
                        <Marker
                            key={car._id}
                            position={[car.location.lat, car.location.lng]}
                            icon={L.icon({
                                iconUrl: carStatus[car._id] === 'In-Trip'
                                    ? 'https://img.icons8.com/?size=100&id=7880&format=png&color=FF0000'
                                    : 'https://img.icons8.com/?size=100&id=7880&format=png&color=008000',
                                iconSize: [35, 35]
                            })}
                            eventHandlers={{ click: () => handleMarkerClick(car._id) }}
                        >
                            <Tooltip>
                                {carStatus[car._id] || 'Checking...'}
                            </Tooltip>
                        </Marker>
                    ))}
                </MapContainer>
            </div>
            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-sm mx-auto">
                        <h3 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">Booking Conflict</h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">The car is already booked for the following dates:</p>
                        <ul className="list-disc list-inside mb-4">
                            {conflictingBookings.map((booking, index) => (
                                <li key={index}>
                                    From: {new Date(booking.startDateTime).toLocaleString()} - To: {new Date(booking.endDateTime).toLocaleString()}
                                </li>
                            ))}
                        </ul>
                        <button
                            onClick={() => setShowModal(false)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-300 transition duration-300"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}


            <ul className="flex flex-wrap justify-center gap-4">
                {filteredCars.map((car) => (
                    <li
                        key={car._id}
                        className="w-[300px] p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-md text-center">
                        <div className="text-lg font-semibold text-gray-800 dark:text-white mb-2 capitalize">
                            {car.make} {car.model} - {car.year}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                            Rent: {car.rate}$/day
                        </div>

                        <div className=' flex justify-center gap-3 ' >

                            {isAdmin ? (
                                <button
                                    onClick={() => deleteCar(car._id)}
                                    className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-500 focus:outline-none focus:ring focus:ring-red-300 transition duration-300">
                                    Delete Car
                                </button>
                            ) : (
                                <button
                                    onClick={() => handleSelectDeselect(car._id)}
                                    className={`px-4 py-2 text-white rounded-lg transition duration-300 ${selectedCar === car._id ? 'bg-gray-500 hover:bg-gray-400' : 'bg-blue-600 hover:bg-blue-500'
                                        }`}>
                                    {selectedCar === car._id ? 'Deselect' : 'Select'}
                                </button>
                            )}
                            <Link to={`/car/${encodeURIComponent(car.regNo)}`}>
                                <button className='px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-300 transition duration-300' >
                                    More Details
                                </button>
                            </Link>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Cars;
