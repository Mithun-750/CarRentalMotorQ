import React, { useState, useEffect, useContext } from 'react';
import { Link, useParams } from 'react-router-dom';
import { CarContext } from '../context/CarContext';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import { AuthContext } from '../context/AuthContext';

const CarDetails = () => {
    const { registration } = useParams();
    const decodedRegistration = decodeURIComponent(registration);
    const { cars, getCarReviews } = useContext(CarContext);
    const { isAdmin } = useContext(AuthContext);
    const [car, setCar] = useState(null);
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        const carDetail = cars.find(car => car.regNo === decodedRegistration);
        setCar(carDetail);

        if (carDetail) {
            getCarReviews(carDetail._id).then(setReviews);
        }
    }, [decodedRegistration, cars]);

    if (!car) return <div className="text-white">Loading...</div>;

    const carIcon = L.icon({
        iconUrl: 'https://img.icons8.com/?size=100&id=7880&format=png&color=FF0000',
        iconSize: [25, 25]
    });

    return (
        <div className="p-6 max-w-screen-lg mx-auto text-white bg-gray-900">
            <h1 className="text-3xl font-bold mb-4 capitalize">{car.make} {car.model}</h1>
            <p className="text-lg">Registration: {car.regNo}</p>
            <p className="text-lg">Year: {car.year}</p>
            <p className="text-lg">Rate: {car.rate}$/day</p>
            <div className="my-6">
                <MapContainer center={[car.location.lat, car.location.lng]} zoom={13} className="h-60">
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <Marker position={[car.location.lat, car.location.lng]} icon={carIcon} />
                </MapContainer>
            </div>
            {isAdmin && (<Link className=' mx-auto' to={`/car/edit/${encodeURIComponent(car.regNo)}`}>
                <button className='px-4 w-full py-2 mb-3 mx-auto text-white bg-blue-500 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-300 transition duration-300' >
                    Edit
                </button>
            </Link>)}
            <h2 className="text-2xl font-semibold mb-2">Customer Reviews</h2>
            {reviews.length > 0 ? (
                reviews.map((review, index) => (
                    <div key={index} className="bg-gray-800 shadow-md p-6 rounded-lg mb-6">
                        <div className="flex items-center space-x-2 mb-4">
                            <div className="flex items-center space-x-1 text-yellow-400">
                                {[...Array(5)].map((_, i) => (
                                    <svg key={i} xmlns="http://www.w3.org/2000/svg" className={`w-5 h-5 ${i < review.rating ? 'text-yellow-400' : 'text-gray-600'}`} fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z" clipRule="evenodd" />
                                    </svg>
                                ))}
                            </div>
                            <p className="text-gray-400">{review.rating} out of 5 stars</p>
                        </div>

                        <h3 className="text-lg font-semibold mb-2 text-white">{review.feedbackTitle || 'Review'}</h3>
                        <p className="text-gray-300 mb-4">{review.feedback}</p>

                        <div className="text-sm text-gray-500">
                            <p className="font-semibold text-gray-400">{review.reviewerName}</p>
                            <time dateTime={review.reviewDate}>{new Date(review.reviewDate).toLocaleDateString()}</time>
                        </div>
                    </div>
                ))
            ) : (
                <p className="text-gray-300">No reviews available for this car.</p>
            )}
        </div>
    );
};

export default CarDetails;
