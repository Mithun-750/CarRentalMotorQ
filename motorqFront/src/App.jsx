import React, { useState, useEffect, useContext } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import './App.css';
import AddCars from './components/AddCars';
import { BookingProvider } from './context/BookingContext';
import { CarProvider } from './context/CarContext';
import Cars from './components/Cars';
import { AuthContext, AuthProvider } from './context/AuthContext';
import CustomerSignIn from './components/CustomerSignin';
import CustomerSignUp from './components/CustomerSignup';
import AdminSignIn from './components/AdminSignin';
import { Navbar } from './components/navbar';
import { Details } from './components/Details';
import MyBookings from './components/MyBookings';
import CarDetails from './components/CarDetails';
import EditCar from './components/EditCar';
import { SocketProvider } from './context/SocketContext';
import CurrentBookings from './components/CurrentBookings';

function App() {
  const [showNavbar, setShowNavbar] = useState(true);
  const location = useLocation();
  const { isAdmin } = useContext(AuthContext)

  useEffect(() => {
    // Determine if Navbar should be shown based on current pathname
    const authPaths = ['/signin', '/signup', '/admin/signin'];
    setShowNavbar(!authPaths.includes(location.pathname));
  }, [location.pathname]);

  return (
    <div className='text-white bg-gray-900 max-w-[100vw] overflow-x-hidden min-h-screen'>
      {showNavbar && <Navbar />}
      <Routes >
        <Route path="/signin" element={<CustomerSignIn />} />
        <Route path="/signup" element={<CustomerSignUp />} />
        <Route path="/admin/signin" element={<AdminSignIn />} />
        <Route path="/" element={<Cars />} />
        {isAdmin && <Route path="/addcar" element={<AddCars />} />}
        {!isAdmin && <Route path="/mybookings" element={<MyBookings />} />}
        <Route path="/details" element={<Details />} />
        <Route path="/currentbookings" element={<CurrentBookings/>} />
        <Route path="/car/:registration" element={<CarDetails />} />
        <Route path="/car/edit/:registration" element={<EditCar />} />

      </Routes>
    </div>
  );
}

export const AppwithContext = () => {
  return (
    <Router>
      <AuthProvider>
        <SocketProvider>
          <CarProvider>
            <BookingProvider>
              <App />
            </BookingProvider>
          </CarProvider>
        </SocketProvider>
      </AuthProvider>
    </Router>
  );
}
